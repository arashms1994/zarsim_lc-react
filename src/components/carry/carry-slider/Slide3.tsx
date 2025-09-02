import { useEffect, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";
import PersianDatePicker from "@/components/persian-date-picker/PersianDatePicker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { addNotificationItem, updateCarryReceiptStatus } from "@/api/addData";
import { toast } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";
import { TOAST_CONFIG } from "@/utils/constants";

const Slide3: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
  userName,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<string[]>(
    selectedReceipts?.map((r) => r.Status ?? "0") || []
  );

  const subFolder = carryPhaseGUID || "";
  const queryClient = useQueryClient();

  const rejectVersion = Number(selectedReceipts?.[0]?.Reject_Version || 0);

  const [allDocTypes, setAllDocTypes] = useState<string[]>(["namehpoosheshi"]);

  useEffect(() => {
    if (rejectVersion > 0) {
      const dynamicDocs = Array.from({ length: rejectVersion }, (_, i) => `namehpoosheshi_v${i + 1}`);
      setAllDocTypes(["namehpoosheshi", ...dynamicDocs]);
    } else {
      setAllDocTypes(["namehpoosheshi"]);
    }
  }, [rejectVersion]);

  const uploadedData = useMultipleUploadedFiles(faktorNumber, subFolder, allDocTypes);

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

  const handleUploadComplete = (docTypeKey: string) => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docTypeKey],
    });
  };

  const isCompleted = localStatus.every((status) => Number(status) >= 4);

  const handleSubmit = async () => {
    const allUploaded = allDocTypes.every((docType) => !!uploadedFiles[docType]);
    if (!allUploaded) {
      toast.error("لطفاً همه فایل‌های الزامی را آپلود کنید.", TOAST_CONFIG);
      return;
    }
    if (!selectedDate) {
      toast.error("تاریخی انتخاب نشده است", TOAST_CONFIG);
      return;
    }
    if (itemIds.length === 0) {
      toast.error("آیتم‌های Carry Receipt مشخص نشده‌اند!", TOAST_CONFIG);
      return;
    }

    try {
      const dateObject = new DateObject({
        date: selectedDate,
        calendar: persian,
        locale: persian_fa,
      });
      const gregorianDateObject = dateObject.convert(gregorian, gregorian_en);
      const fromDate = gregorianDateObject.toDate();
      const deadlineDate = new Date(fromDate);
      deadlineDate.setDate(deadlineDate.getDate() + 3);

      const fromDateFormatted = gregorianDateObject.format("M/D/YYYY");
      const deadlineFormatted = `${
        deadlineDate.getMonth() + 1
      }/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`;

      await addNotificationItem({
        Title: "پیگیری رسید بانک",
        dont_show: "0",
        From_Date: fromDateFormatted,
        deadline: deadlineFormatted,
        assign: String(userName),
        massage: "لطفا رسید بانک را آپلود کنید.",
        Item_URL: `https://portal.zarsim.com/SitePages/lcdocuments.aspx/carry?Factor_ID=${faktorNumber}`,
      });

      await updateCarryReceiptStatus(itemIds, "4");

      setSelectedDate(null);
      setLocalStatus(itemIds.map(() => "4"));

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
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        {allDocTypes.map((doc, index) => (
          <UploadSection
            key={doc}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={doc}
            label={index === 0 ? "نامه پوششی" : `نسخه اصلاحیه ${index}`}
            onUploadComplete={() => handleUploadComplete(doc)}
          />
        ))}
      </div>

      <div className="py-5">
        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">
            تاریخ ارسال اسناد به بانک:
          </label>
          <PersianDatePicker
            value={selectedDate}
            onChange={(date: string) => setSelectedDate(date)}
          />
        </div>

        <div className="flex justify-center items-center">
          {isCompleted ? (
            <SectionHeader title="این قسمت تکمیل شده است، لطفا به اسلاید بعد مراجعه کنید." />
          ) : (
            <button
              type="button"
              disabled={!selectedDate || !allDocTypes.every((doc) => uploadedFiles[doc])}
              className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
                ${
                  selectedDate && allDocTypes.every((doc) => uploadedFiles[doc])
                    ? "bg-blue-600 text-white hover:bg-blue-900"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              onClick={handleSubmit}
            >
              ثبت تاریخ و پایان مرحله
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Slide3;
