import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FIRST_SLIDE_DOCS,
  FIRST_SLIDE_DOCS_VERSION2,
  TOAST_CONFIG,
} from "@/utils/constants";
import type { ICarrySlideProps } from "@/utils/type";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { updateCarryReceiptStatus, addNotificationItem } from "@/api/addData";
import { toast } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

const Slide1: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
  userName,
}) => {
  const [localReceipts, setLocalReceipts] = useState(selectedReceipts || []);
  const allStatusTwo = localReceipts.every((r) => Number(r.Status) >= 2);
  const subFolder = carryPhaseGUID || "";

  const rejectVersion = useMemo(
    () => Number(selectedReceipts?.[0]?.Reject_Version || 0),
    [selectedReceipts]
  );

  const baseDocTypes = useMemo(() => FIRST_SLIDE_DOCS.map((d) => d.value), []);

  const dynamicDocTypes: string[] = useMemo(() => {
    if (rejectVersion <= 0) return [];
    return Array.from({ length: rejectVersion }, (_, i) =>
      FIRST_SLIDE_DOCS_VERSION2.map((d) => `${d.value}_v${i + 1}`)
    ).flat();
  }, [rejectVersion]);

  const allDocTypes = useMemo(
    () => [...baseDocTypes, ...dynamicDocTypes],
    [baseDocTypes, dynamicDocTypes]
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

  useEffect(() => {
    if (!allDocTypes.length) return;

    allDocTypes.forEach((docType) => {
      const file = uploadedData?.[docType]?.data?.[0];
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

  const lastDocTypes = useMemo(() => {
    return rejectVersion > 0
      ? FIRST_SLIDE_DOCS_VERSION2.map((d) => `${d.value}_v${rejectVersion}`)
      : baseDocTypes;
  }, [rejectVersion, baseDocTypes]);

  const handleSubmit = async () => {
    const allUploaded = lastDocTypes.every(
      (docType) => !!uploadedFiles[docType]
    );
    if (!allUploaded) {
      toast.error("لطفاً همه فایل‌ها را آپلود کنید.", TOAST_CONFIG);
      return;
    }

    if (!itemIds.length) {
      toast.error("آیتم‌های رسید حمل مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }

    try {
      await updateCarryReceiptStatus(itemIds, "2");
      setLocalReceipts((prev) =>
        prev.map((r) => ({
          ...r,
          Status: Number(r.Status) >= 2 ? r.Status : "2",
        }))
      );

      const firstDateStr = selectedReceipts?.[0]?.Date;
      if (firstDateStr) {
        const dateObject = new DateObject({
          date: firstDateStr,
          calendar: persian,
          locale: persian_fa,
        });
        const gregorianDateObject = dateObject.convert(gregorian, gregorian_en);
        const fromDate = gregorianDateObject.toDate();

        const deadlineDate = new Date(fromDate);
        deadlineDate.setDate(deadlineDate.getDate() + 5);

        const fromDateFormatted = gregorianDateObject.format("M/D/YYYY");
        const deadlineFormatted = `${
          deadlineDate.getMonth() + 1
        }/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`;

        await addNotificationItem({
          Title: "آماده سازی اسناد",
          dont_show: "0",
          From_Date: fromDateFormatted,
          deadline: deadlineFormatted,
          assign: String(userName),
          massage: "لطفاً اسناد مربوط به حمل را آپلود کنید.",
          Item_URL: `https://portal.zarsim.com/SitePages/lcdocuments.aspx/carry?Factor_ID=${faktorNumber}`,
        });
      }

      toast.success(
        "اطلاعات با موفقیت ثبت شد و وضعیت بروزرسانی شد!",
        TOAST_CONFIG
      );
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت اطلاعات!", TOAST_CONFIG);
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
              FIRST_SLIDE_DOCS_VERSION2.find((d) => d.value === baseValue)
                ?.label || baseValue
            } نسخه ${versionNumber}`
          : FIRST_SLIDE_DOCS.find((d) => d.value === doc)?.label || doc;

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
        {allStatusTwo ? (
          <SectionHeader title="این قسمت تکمیل شده است، لطفا به اسلاید بعد مراجعه کنید." />
        ) : (
          <button
            type="button"
            disabled={
              allStatusTwo ||
              !(rejectVersion > 0
                ? FIRST_SLIDE_DOCS_VERSION2.map(
                    (d) => `${d.value}_v${rejectVersion}`
                  ).every((doc) => uploadedFiles[doc])
                : baseDocTypes.every((doc) => uploadedFiles[doc]))
            }
            className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
              ${
                !allStatusTwo &&
                (rejectVersion > 0
                  ? FIRST_SLIDE_DOCS_VERSION2.map(
                      (d) => `${d.value}_v${rejectVersion}`
                    ).every((doc) => uploadedFiles[doc])
                  : baseDocTypes.every((doc) => uploadedFiles[doc]))
                  ? "bg-blue-600 text-white hover:bg-blue-900"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            onClick={handleSubmit}
          >
            پایان آپلود فایل‌های مرتبط با حمل
          </button>
        )}
      </div>
    </div>
  );
};

export default Slide1;
