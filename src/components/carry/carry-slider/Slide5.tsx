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
  addNotificationItem,
} from "@/api/addData";
import { toast } from "react-toastify";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useCustomerFactor } from "@/api/getData";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";

const Slide5: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
  userName,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<string[]>(
    selectedReceipts?.map((r) => r.Status ?? "0") || []
  );

  const queryClient = useQueryClient();
  const subFolder = carryPhaseGUID || "";
  const baseDocType = "taeidasnad";
  const label = "رسید تایید اسناد توسط بانک";

  const { data: factorData } = useCustomerFactor(faktorNumber);
  const mabnavalue = factorData?.mabnavalue;
  const tarikhmabnavalue = factorData?.tarikhmabnavalue;

  const rejectVersion = useMemo(
    () => Number(selectedReceipts?.[0]?.Reject_Version || 0),
    [selectedReceipts]
  );

  const dynamicDocTypes = useMemo(() => {
    if (rejectVersion <= 0) return [];
    return Array.from(
      { length: rejectVersion },
      (_, i) => `${baseDocType}_v${i + 1}`
    );
  }, [rejectVersion]);

  const allDocTypes = useMemo(
    () => [baseDocType, ...dynamicDocTypes],
    [dynamicDocTypes]
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
    if (!itemIds.length) {
      toast.error("آیتم‌های Carry Receipt مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }

    try {
      await updateCarryReceiptStatus(itemIds, "6");
      setLocalStatus(itemIds.map(() => "6"));

      await updateCarryBankConfirmation(itemIds, "0");

      if (!mabnavalue || !tarikhmabnavalue) {
        throw new Error("مقدار mabnavalue یا tarikhmabnavalue معتبر نیست.");
      }

      let fromDateStr: string | null | undefined;
      switch (mabnavalue) {
        case "از تاریخ گشایش":
          fromDateStr = factorData?.tarikhgoshayesh;
          break;
        case "از تاریخ ابلاغ":
          fromDateStr = factorData?.tarikheblagh;
          break;
        case "از تاریخ حمل/بارنامه":
          fromDateStr = selectedReceipts?.[0]?.Date;
          break;
        case "از تاریخ فاکتور":
          fromDateStr = factorData?.Date;
          break;
        case "از تاریخ ارائه اسناد به بانک/ معامله اسناد/ رسید دریافت بانک":
          fromDateStr = factorData?.tarikhresidebank;
          break;
        default:
          throw new Error("مقدار mabnavalue معتبر نیست.");
      }

      if (!fromDateStr) {
        throw new Error("تاریخ مبنا معتبر نیست یا یافت نشد.");
      }

      const dateObject = new DateObject({
        date: fromDateStr,
        calendar: persian,
        locale: persian_fa,
      });
      const gregorianDateObject = dateObject.convert(gregorian, gregorian_en);
      const fromDateFormatted = gregorianDateObject.format("M/D/YYYY");

      const daysToAdd = Number(tarikhmabnavalue) || 0;
      const deadlineDate = gregorianDateObject.toDate();
      deadlineDate.setDate(deadlineDate.getDate() + daysToAdd);
      const deadlineFormatted = `${
        deadlineDate.getMonth() + 1
      }/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`;

      await addNotificationItem({
        Title: "پیگیری واریز مبلغ توسط بانک",
        dont_show: "0",
        From_Date: fromDateFormatted,
        deadline: deadlineFormatted,
        assign: String(userName),
        massage: "لطفاً واریز مبلغ توسط بانک را پیگیری کنید.",
        Item_URL: `https://portal.zarsim.com/SitePages/lcdocuments.aspx/carry?Factor_ID=${faktorNumber}`,
      });

      toast.success("وضعیت همه آیتم‌ها با موفقیت بروزرسانی شد!", TOAST_CONFIG);
    } catch (error) {
      console.error(error);
      toast.error("خطا در بروزرسانی وضعیت یا ارسال ناتیفیکیشن!", TOAST_CONFIG);
    }
  };

  const handleReject = async () => {
    if (!itemIds.length) {
      toast.error("آیتم‌های Carry Receipt مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }

    setRejectModalOpen(true);
  };

  const onRejected = async () => {
    try {
      await updateCarryBankConfirmation(itemIds, "1");
      setLocalStatus(itemIds.map(() => "2"));

      queryClient.invalidateQueries({
        queryKey: ["uploadedFiles", faktorNumber, subFolder, baseDocType],
      });

      toast.info("اسناد رد شد و نسخه اصلاحیه فعال شد.", TOAST_CONFIG);
    } catch (error) {
      console.error(error);
      toast.error("خطا در بروزرسانی وضعیت رد!", TOAST_CONFIG);
    } finally {
      setRejectModalOpen(false);
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
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!uploadedFiles[baseDocType]}
                className={`min-w-[200px] mt-5 p-3 text-[18px] font-semibold
                  ${
                    uploadedFiles[baseDocType]
                      ? "bg-blue-600 text-white hover:bg-blue-900"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
              >
                تایید اسناد توسط بانک
              </Button>

              <Button
                type="button"
                onClick={handleReject}
                className="min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-red-600 text-white hover:bg-red-900"
              >
                رد اسناد توسط بانک
              </Button>
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
              onRejected={onRejected}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Slide5;
