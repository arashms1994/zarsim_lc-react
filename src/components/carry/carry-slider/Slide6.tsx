import { useEffect, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { updateCarryReceiptStatus } from "@/api/addData";
import { toast } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";
import { TOAST_CONFIG } from "@/utils/constants";

const Slide6: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
}) => {
  const label = "رسید واریز مبلغ";
  const subFolder = carryPhaseGUID || "";
  const docType = "residvariz";
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

  const isCompleted = localStatus.every((status) => Number(status) >= 7);

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
      await updateCarryReceiptStatus(itemIds, "7");
      setLocalStatus(itemIds.map(() => "7"));

      toast.success("وضعیت همه آیتم‌ها با موفقیت بروزرسانی شد!", TOAST_CONFIG);
    } catch (error) {
      console.error(error);
      toast.error("خطا در بروزرسانی وضعیت!", TOAST_CONFIG);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <UploadSection
        orderNumber={faktorNumber}
        subFolder={subFolder}
        docType={docType}
        label={label}
        onUploadComplete={handleUploadComplete}
      />

      <div className="mt-5">
        {isCompleted ? (
          <SectionHeader title={"این مرحله حمل به پایان یافت."} />
        ) : (
          <button
            type="button"
            disabled={!uploadedFiles[docType]}
            className={`border-none rounded-lg min-w-[200px] p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
              ${
                uploadedFiles[docType]
                  ? "bg-blue-600 text-white hover:bg-blue-900"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            onClick={handleSubmit}
          >
            تایید واریز مبلغ توسط بانک
          </button>
        )}
      </div>
    </div>
  );
};

export default Slide6;
