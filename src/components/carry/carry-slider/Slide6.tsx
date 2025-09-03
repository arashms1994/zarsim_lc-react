import { useEffect, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { updateCarryReceiptStatus, addNotificationItem } from "@/api/addData";
import { toast } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";
import { TOAST_CONFIG } from "@/utils/constants";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useCarryReceipts, useCustomerFactor } from "@/api/getData";

const Slide6: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
  userName,
}) => {
  const label = "رسید واریز مبلغ";
  const subFolder = carryPhaseGUID || "";
  const docType = "residvariz";
  const queryClient = useQueryClient();

  const { data: faktor } = useCustomerFactor(faktorNumber);
  const { data: receipts } = useCarryReceipts(faktorNumber);
  const [localStatus, setLocalStatus] = useState<string[]>(
    selectedReceipts?.map((r) => r.Status ?? "0") || []
  );

  const isCompleted = localStatus.every((status) => Number(status) >= 7);

  const totalCount =
    receipts?.reduce((sum, receipt) => sum + (Number(receipt.Count) || 0), 0) ||
    0;
  const totalAmount =
    receipts?.reduce((sum, receipt) => sum + (Number(receipt.Total) || 0), 0) ||
    0;

  const toleranceMosbat = Number(faktor?.tolerance_mosbat) || Infinity;
  const toleranceManfi = Number(faktor?.tolerance_manfi) || -Infinity;

  const isWithinTolerance =
    totalCount >= toleranceManfi &&
    totalCount <= toleranceMosbat &&
    totalAmount >= toleranceManfi &&
    totalAmount <= toleranceMosbat;

  const { data: files } = useUploadedFiles(faktorNumber, subFolder, docType);
  const fileFromServer = files?.[0];
  const fileUrl = fileFromServer
    ? `${BASE_URL}${fileFromServer.ServerRelativeUrl}`
    : null;

  const itemIds =
    selectedReceipts?.map((r) => r.Id).filter((id): id is number => !!id) || [];

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

      if (isWithinTolerance) {
        const today = new DateObject({
          calendar: gregorian,
          locale: gregorian_en,
        });
        const fromDateFormatted = today.format("M/D/YYYY");

        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + 1);
        const deadlineFormatted = `${
          deadlineDate.getMonth() + 1
        }/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`;

        await addNotificationItem({
          Title: "ثبت اختتامیه اعتبار اسنادی",
          dont_show: "0",
          From_Date: fromDateFormatted,
          deadline: deadlineFormatted,
          assign: String(userName),
          massage: "لطفاً اختتامیه اعتبار اسنادی را ثبت کنید.",
          Item_URL: `https://portal.zarsim.com/SitePages/lcdocuments.aspx/LCEnding?Factor_ID=${faktorNumber}`,
        });
      }

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
