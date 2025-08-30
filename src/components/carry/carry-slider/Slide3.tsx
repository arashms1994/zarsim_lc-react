import { useEffect, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import UploadSection from "@/components/ui/UploadSection";
import persian from "react-date-object/calendars/persian";
import DateObject from "react-date-object";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

const Slide3: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const subFolder = carryPhaseGUID || "";
  const docType = "namehpoosheshi";
  const label = "نامه پوششی";
  const queryClient = useQueryClient();

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

  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectedDate) {
      const dateObject = new DateObject({
        date: selectedDate,
        calendar: persian,
        locale: persian_fa,
      });

      const gregorianDateObject = dateObject.convert(gregorian, gregorian_en);
      const gregorianDate = gregorianDateObject.format("M/D/YYYY");

      console.log("تاریخ شمسی:", selectedDate);
      console.log("تاریخ میلادی:", gregorianDate);
    } else {
      console.log("تاریخی انتخاب نشده است");
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
      <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
        <label className="text-[22px] font-medium">تاریخ گشایش:</label>
        <PersianDatePicker
          value={selectedDate}
          onChange={(date: string) => setSelectedDate(date)}
        />
      </div>
      <div className="flex justify-center items-center py-5">
        <button
          type="submit"
          className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
          onClick={handleSubmit}
        >
          ثبت اختتامیه اعتبار اسنادی
        </button>
      </div>
    </>
  );
};

export default Slide3;
