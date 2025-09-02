import { useEffect, useMemo, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import {
  SECOND_SLIDE_DOCS,
  SECOND_SLIDE_DOCS_VERSION2,
  TOAST_CONFIG,
} from "@/utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { updateCarryReceiptStatus } from "@/api/addData";
import { toast } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide2: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
}) => {
  const [localReceipts, setLocalReceipts] = useState(selectedReceipts || []);
  const allStatusThree = localReceipts.every((r) => Number(r.Status) >= 3);
  const subFolder = carryPhaseGUID || "";

  const rejectVersion = useMemo(
    () => Number(selectedReceipts?.[0]?.Reject_Version || 0),
    [selectedReceipts]
  );

  const baseDocTypes = useMemo(() => SECOND_SLIDE_DOCS.map((d) => d.value), []);
  const dynamicDocTypes = useMemo(() => {
    if (rejectVersion <= 0) return [];
    return Array.from({ length: rejectVersion }, (_, i) =>
      SECOND_SLIDE_DOCS_VERSION2.map((d) => `${d.value}_v${i + 1}`)
    ).flat();
  }, [rejectVersion]);

  const allDocTypes = useMemo(
    () => [...baseDocTypes, ...dynamicDocTypes],
    [baseDocTypes, dynamicDocTypes]
  );

  const lastDocTypes = useMemo(
    () =>
      rejectVersion > 0
        ? dynamicDocTypes.filter((d) => d.endsWith(`_v${rejectVersion}`))
        : baseDocTypes,
    [rejectVersion, baseDocTypes, dynamicDocTypes]
  );

  const queryClient = useQueryClient();
  const uploadedData = useMultipleUploadedFiles(
    faktorNumber,
    subFolder,
    allDocTypes
  );

  const itemIds =
    selectedReceipts
      ?.map((r) => r.Id)
      .filter((id): id is number => typeof id === "number") || [];

  // بروزرسانی فایل‌های آپلود شده
  useEffect(() => {
    if (!allDocTypes.length) return;

    allDocTypes.forEach((docType) => {
      const file = uploadedData[docType]?.data?.[0];
      const fileUrl = file ? `${BASE_URL}${file.ServerRelativeUrl}` : null;
      if (fileUrl && uploadedFiles[docType] !== fileUrl) {
        setUploadedFiles((prev) => ({ ...prev, [docType]: fileUrl }));
      }
    });
  }, [allDocTypes, uploadedData, uploadedFiles, setUploadedFiles]);

  const handleUploadComplete = (docType: string) => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
    });
  };

  const handleSubmit = async () => {
    const allUploaded = lastDocTypes.every((doc) => !!uploadedFiles[doc]);
    if (!allUploaded) {
      toast.error("لطفاً همه فایل‌ها را آپلود کنید.", TOAST_CONFIG);
      return;
    }
    if (!itemIds.length) {
      toast.error("آیتم‌های رسید حمل مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }
    try {
      await updateCarryReceiptStatus(itemIds, "3");
      setLocalReceipts((prev) =>
        prev.map((r) => ({
          ...r,
          Status: Number(r.Status) >= 3 ? r.Status : "3",
        }))
      );
      toast.success(
        "اطلاعات با موفقیت ثبت شد و وضعیت بروزرسانی شد!",
        TOAST_CONFIG
      );
    } catch (error) {
      console.error(error);
      toast.error("خطا در آپدیت وضعیت رسید حمل!", TOAST_CONFIG);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {allDocTypes.map((doc) => {
        const isRevision = doc.includes("_v");
        const baseValue = isRevision ? doc.split("_v")[0] : doc;
        const versionNumber = isRevision ? doc.split("_v")[1] : null;

        const docLabel = isRevision
          ? `${
              SECOND_SLIDE_DOCS_VERSION2.find((d) => d.value === baseValue)
                ?.label || baseValue
            } نسخه ${versionNumber}`
          : SECOND_SLIDE_DOCS.find((d) => d.value === doc)?.label || doc;

        return (
          <UploadSection
            key={doc}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={doc}
            label={docLabel}
            onUploadComplete={() => handleUploadComplete(doc)}
          />
        );
      })}

      <div>
        {allStatusThree ? (
          <SectionHeader title="این قسمت تکمیل شده است، لطفا به اسلاید بعد مراجعه کنید." />
        ) : (
          <button
            type="button"
            disabled={!lastDocTypes.every((doc) => uploadedFiles[doc])}
            className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
              ${
                lastDocTypes.every((doc) => uploadedFiles[doc])
                  ? "bg-blue-600 text-white hover:bg-blue-900"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            onClick={handleSubmit}
          >
            پایان آپلود فایل‌های مرتبط با آماده سازی اسناد
          </button>
        )}
      </div>
    </div>
  );
};

export default Slide2;
