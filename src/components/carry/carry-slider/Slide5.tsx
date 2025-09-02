import { useEffect, useMemo, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { MODAL_CLASSES, TOAST_CONFIG } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import BankRejectionModal from "@/components/ui/BankRejectionModal";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  updateCarryBankConfirmation,
  updateCarryReceiptStatus,
} from "@/api/addData";
import { toast } from "react-toastify";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";

const Slide5: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<string[]>(
    selectedReceipts?.map((r) => r.Status ?? "0") || []
  );

  const subFolder = carryPhaseGUID || "";
  const queryClient = useQueryClient();

  const rejectVersion = useMemo(
    () => Number(selectedReceipts?.[0]?.Reject_Version || 0),
    [selectedReceipts]
  );

  const baseDocType = useMemo(() => "taeidasnad", []);
  const label = "رسید تایید اسناد توسط بانک";

  const dynamicDocTypes: string[] = useMemo(() => {
    if (rejectVersion <= 0) return [];
    return Array.from(
      { length: rejectVersion },
      (_, i) => `${baseDocType}_v${i + 1}`
    );
  }, [rejectVersion, baseDocType]);

  const allDocTypes = useMemo(
    () => [baseDocType, ...dynamicDocTypes],
    [baseDocType, dynamicDocTypes]
  );

  const uploadedData = useMultipleUploadedFiles(
    faktorNumber,
    subFolder,
    allDocTypes
  );

  useEffect(() => {
    allDocTypes.forEach((docType) => {
      const file = uploadedData?.[docType]?.data?.[0];
      const fileUrl = file ? `${BASE_URL}${file.ServerRelativeUrl}` : null;
      if (fileUrl && uploadedFiles[docType] !== fileUrl) {
        setUploadedFiles((prev) => ({ ...prev, [docType]: fileUrl }));
      }
    });
  }, [allDocTypes, uploadedData, uploadedFiles, setUploadedFiles]);

  const itemIds =
    selectedReceipts?.map((r) => r.Id).filter((id): id is number => !!id) || [];

  const isCompleted = localStatus.every((status) => Number(status) >= 6);
  const isRejected = selectedReceipts?.some((r) => r.Bank_Confirm === "1");

  const handleUploadComplete = (docType: string) => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
    });
  };

  const handleConfirm = async () => {
    if (!uploadedFiles[baseDocType]) {
      toast.error("لطفاً فایل اصلی را آپلود کنید.", TOAST_CONFIG);
      return;
    }
    if (itemIds.length === 0) {
      toast.error("آیتم‌های Carry Receipt مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }

    try {
      await updateCarryReceiptStatus(itemIds, "6");
      setLocalStatus(itemIds.map(() => "6"));
      await updateCarryBankConfirmation(itemIds, "0");
      toast.success("وضعیت همه آیتم‌ها با موفقیت بروزرسانی شد!", TOAST_CONFIG);
    } catch (error) {
      console.error(error);
      toast.error("خطا در بروزرسانی وضعیت!", TOAST_CONFIG);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        {allDocTypes.map((docType) => (
          <UploadSection
            key={docType}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={docType}
            label={
              docType === baseDocType
                ? label
                : `نسخه اصلاحیه ${docType.split("_v")[1]}`
            }
            onUploadComplete={() => handleUploadComplete(docType)}
          />
        ))}

        <div className="flex gap-4 justify-between items-center">
          {isCompleted ? (
            <SectionHeader title="این قسمت تکمیل شده است، لطفا به اسلاید بعد مراجعه کنید." />
          ) : (
            <>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!uploadedFiles[baseDocType]}
                className={`border-none mt-5 rounded-lg min-w-[200px] p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
                  ${
                    uploadedFiles[baseDocType]
                      ? "bg-blue-600 text-white hover:bg-blue-900"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
              >
                تایید اسناد توسط بانک
              </button>

              <button
                type="button"
                className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-red-600 text-white transition-all duration-300 cursor-pointer hover:bg-red-900"
                onClick={() => setRejectModalOpen(true)}
              >
                رد اسناد توسط بانک
              </button>
            </>
          )}
        </div>

        {isRejected && (
          <SectionHeader
            className="bg-red-600 text-white"
            title="اسناد توسط بانک رد شده است، لطفا در اسرع وقت نسبت به اصلاح و ارسال اسناد اقدام نمایید."
          />
        )}
      </div>

      {rejectModalOpen && (
        <div className={MODAL_CLASSES.overlay}>
          <div className={`${MODAL_CLASSES.container} w-[350px] h-[300px]`}>
            <Button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className={MODAL_CLASSES.closeButton}
            >
              X
            </Button>
            <BankRejectionModal
              itemIds={itemIds}
              onClose={() => setRejectModalOpen(false)}
              onRejected={() => {
                setLocalStatus(itemIds.map(() => "2"));
                queryClient.invalidateQueries({
                  queryKey: [
                    "uploadedFiles",
                    faktorNumber,
                    subFolder,
                    baseDocType,
                  ],
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Slide5;
