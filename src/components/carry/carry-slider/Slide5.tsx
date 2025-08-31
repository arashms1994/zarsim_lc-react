import { useEffect, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { MODAL_CLASSES, TOAST_CONFIG } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import BankRejectionModal from "@/components/ui/BankRejectionModal";
import SectionHeader from "@/components/ui/SectionHeader";
import { updateCarryReceiptStatus } from "@/api/addData";
import { toast } from "react-toastify";

const Slide5: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const label = "رسید تایید اسناد توسط بانک";
  const subFolder = carryPhaseGUID || "";
  const docType = "taeidasnad";
  const queryClient = useQueryClient();

  const { data: files } = useUploadedFiles(faktorNumber, subFolder, docType);
  const fileFromServer = files?.[0];
  const fileUrl = fileFromServer
    ? `${BASE_URL}${fileFromServer.ServerRelativeUrl}`
    : null;

  const itemIds =
    selectedReceipts?.map((r) => r.Id).filter((id): id is number => !!id) || [];

  const [localStatus, setLocalStatus] = useState<string[]>(
    selectedReceipts?.map((r) => r.Status ?? "0") || []
  );

  const isCompleted = localStatus.every((status) => Number(status) >= 6);

  useEffect(() => {
    if (fileUrl && uploadedFiles[docType] !== fileUrl) {
      setUploadedFiles((prev) => ({ ...prev, [docType]: fileUrl }));
    }
  }, [fileUrl, uploadedFiles, setUploadedFiles, docType]);

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
    });
  };

  const handleSubmit = async () => {
    if (!uploadedFiles[docType]) {
      toast.error("لطفاً فایل را آپلود کنید.", TOAST_CONFIG);
      return;
    }

    if (itemIds.length === 0) {
      toast.error("آیتم‌های Carry Receipt مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }

    try {
      await updateCarryReceiptStatus(itemIds, "6");
      setLocalStatus(itemIds.map(() => "6"));

      toast.success("وضعیت همه آیتم‌ها با موفقیت بروزرسانی شد!", TOAST_CONFIG);
    } catch (error) {
      console.error(error);
      toast.error("خطا در بروزرسانی وضعیت!", TOAST_CONFIG);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        <UploadSection
          orderNumber={faktorNumber}
          subFolder={subFolder}
          docType={docType}
          label={label}
          onUploadComplete={handleUploadComplete}
        />

        <div className="flex gap-4 justify-between items-center">
          {isCompleted ? (
            <SectionHeader title="این قسمت تکمیل شده است، لطفا به اسلاید بعد مراجعه کنید." />
          ) : selectedReceipts?.some((r) => r.Bank_Confirm === "1") ? (
            <SectionHeader
              className="bg-red-600 text-white"
              title="اسناد توسط بانک رد شده است، لطفا در اسرع وقت نسبت به اصلاح و ارسال اسناد اقدام نمایید."
            />
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!uploadedFiles[docType]}
                className={`border-none mt-5 rounded-lg min-w-[200px] p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
        ${
          uploadedFiles[docType]
            ? "bg-blue-600 text-white hover:bg-blue-900"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
              >
                تایید اسناد توسط بانک
              </button>

              <button
                type="button"
                className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-red-600 text-white transition-all duration-300 cursor-pointer hover:bg-red-900"
                onClick={() => setModalOpen(true)}
              >
                رد اسناد توسط بانک
              </button>
            </>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className={MODAL_CLASSES.overlay}>
          <div className={`${MODAL_CLASSES.container} w-[350px] h-[300px]`}>
            <Button
              type="button"
              onClick={() => {
                setModalOpen(false);
              }}
              className={MODAL_CLASSES.closeButton}
            >
              X
            </Button>
            <BankRejectionModal
              itemIds={itemIds}
              onClose={() => setModalOpen(false)}
              onRejected={() => {
                setLocalStatus(itemIds.map(() => "2"));
                queryClient.invalidateQueries({
                  queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
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
