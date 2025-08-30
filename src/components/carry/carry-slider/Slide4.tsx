import { useEffect, useState } from "react";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import type { ICarrySlideProps } from "@/utils/type";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import PersianDatePicker from "@/components/persian-date-picker/PersianDatePicker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { addNotificationItem, updateCarryReceiptStatus } from "@/api/addData";
import { Bounce, toast } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide4: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const label = "رسید بانک";
  const subFolder = carryPhaseGUID || "";
  const docType = "residebank";
  const queryClient = useQueryClient();

  const firstItem = selectedReceipts?.[0];
  const firstItemId = firstItem?.Id;
  const isCompleted = firstItem && firstItem.Status !== undefined ? firstItem.Status >= "5" : false;

  const { data: files } = useUploadedFiles(faktorNumber, subFolder, docType);
  const fileFromServer = files?.[0];
  const fileUrl = fileFromServer
    ? `${BASE_URL}${fileFromServer.ServerRelativeUrl}`
    : null;

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
      toast.error("لطفاً فایل را آپلود کنید.", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if (!selectedDate) {
      toast.error("تاریخی انتخاب نشده است", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if (!firstItemId) {
      toast.error("آیتم Carry Receipt مشخص نشده است!", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
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
      deadlineDate.setDate(deadlineDate.getDate() + 12);

      const fromDateFormatted = gregorianDateObject.format("M/D/YYYY");
      const deadlineFormatted = `${
        deadlineDate.getMonth() + 1
      }/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`;

      await addNotificationItem({
        Title: "تایید اسناد توسط بانک",
        dont_show: "false",
        From_Date: fromDateFormatted,
        deadline: deadlineFormatted,
        assign: "user1",
        massage: "لطفا تایید اسناد توسط بانک را پیگیری کنید.",
        Item_URL: "https://example.com/item/123",
      });

      await updateCarryReceiptStatus([firstItemId], "5");

      setSelectedDate(null);

      toast.success("اطلاعات با موفقیت ثبت شد و وضعیت آیتم بروزرسانی شد!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت اطلاعات!", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
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
      </div>

      <div className="py-5">
        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تاریخ رسید بانک:</label>
          <PersianDatePicker
            value={selectedDate}
            onChange={(date: string) => setSelectedDate(date)}
          />
        </div>

        <div className="flex justify-center items-center">
          {isCompleted ? (
            <SectionHeader
              title={"این مرحله تکمیل شده است، لطفا به مرحله بعد مراجعه کنید."}
            />
          ) : (
            <button
              type="button"
              disabled={!uploadedFiles[docType]}
              className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
                ${
                  uploadedFiles[docType]
                    ? "bg-blue-600 text-white hover:bg-blue-900"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              onClick={handleSubmit}
            >
              ثبت تاریخ و آپدیت وضعیت
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Slide4;
