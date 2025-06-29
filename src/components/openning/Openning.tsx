import React, { useState } from "react";
import { AddToOpenningDate } from "../../api/addData";
import { formatNumberWithComma } from "../../utils/formatNumberWithComma";
import { LCOpenningDates, settlementDates } from "../../utils/constants";
import { useOutletContext } from "react-router";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type DateObject from "react-date-object";
import FileUploader from "../file-uploader/FileUploader";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Openning = () => {
  const [formData, setFormData] = useState({
    LCTotalPrice: 0,
    LCNumber: "",
    LCOpenningDate: "",
    LCCommunicationDate: "",
    LCSettlementDate: "",
    LCOriginOpenningDate: "",
  });

  const { faktorNumber } = useOutletContext<{ faktorNumber: string }>();
  const [openningDate, setOpenningDate] = useState<DateObject | null>(null);
  const [communicationDate, setCommunicationDate] = useState<DateObject | null>(
    null
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "LCTotalPrice" ? Number(value.replace(/,/g, "")) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await AddToOpenningDate(formData);
      alert("اطلاعات با موفقیت ثبت شد.");
    } catch (error) {
      console.error("خطا در ثبت اطلاعات:", error);
      alert("خطایی در ثبت اطلاعات رخ داد.");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5 py-10"
      >
        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium" htmlFor="LCOpenningDate">
            تاریخ گشایش:
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={openningDate}
            onChange={(date: DateObject) => {
              setOpenningDate(date);
              setFormData((prev) => ({
                ...prev,
                LCOpenningDate: date.format("YYYY/MM/DD"),
              }));
            }}
            inputClass="w-full sm:w-48 px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
            placeholder="تاریخ را انتخاب کنید"
            format="YYYY/MM/DD"
          />
        </div>

        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium" htmlFor="LCNumber">
            شماره اعتبار اسنادی:
          </label>
          <Input
            className="w-48 min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 flex justify-center it"
            type="text"
            name="LCNumber"
            value={formData.LCNumber}
            onChange={handleChange}
            id="LCNumber"
          />
        </div>

        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium" htmlFor="LCTotalPrice">
            مبلغ اعتبار (ریال):
          </label>
          <Input
            className="w-48 min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 flex justify-center it"
            type="text"
            name="LCTotalPrice"
            value={formatNumberWithComma(formData.LCTotalPrice)}
            onChange={handleChange}
            id="LCTotalPrice"
          />
        </div>

        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label
            className="text-[22px] font-medium"
            htmlFor="LCCommunicationDate"
          >
            تاریخ ابلاغ:
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={communicationDate}
            onChange={(date: DateObject) => {
              setCommunicationDate(date);
              setFormData((prev) => ({
                ...prev,
                LCCommunicationDate: date.format("YYYY/MM/DD"),
              }));
            }}
            inputClass="w-full sm:w-48 px-2 py-1 border-2 border-primary rounded-md font-semibold focus:outline-none"
            placeholder="تاریخ را انتخاب کنید"
            format="YYYY/MM/DD"
          />
        </div>

        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label
            className="text-[22px] font-medium"
            htmlFor="LCOriginOpenningDate"
          >
            مبدا گشایش اعتبار:
          </label>
          <Select value={formData.LCOriginOpenningDate} onChange={handleChange}>
            <SelectTrigger
              name="LCOriginOpenningDate"
              id="LCOriginOpenningDate"
              className="w-48 min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg  border-2"
            >
              <SelectValue placeholder="یک گزینه انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {LCOpenningDates.map(({ value, label }) => (
                <SelectItem
                  key={value || "empty"}
                  value={value}
                  className="min-h-[30px] p-1 text-[18px] font-normal text-gray-800 rounded-lg"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium" htmlFor="LCSettlementDate">
            مدت زمان تسویه:
          </label>
          <Select value={formData.LCOriginOpenningDate} onChange={handleChange}>
            <SelectTrigger
              name="LCOriginOpenningDate"
              id="LCOriginOpenningDate"
              className="w-48 min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg  border-2"
            >
              <SelectValue placeholder="یک گزینه انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {settlementDates.map(({ value, label }) => (
                <SelectItem
                  key={value || "empty"}
                  value={value}
                  className="min-h-[30px] p-1 text-[18px] font-normal text-gray-800 rounded-lg"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full max-w-[400px] flex justify-between items-center gap-5">
          <label
            className="text-[22px] font-medium"
            htmlFor="openningUploadFile"
          >
            آپلود ابلاغیه:
          </label>
          <FileUploader
            orderNumber={faktorNumber}
            subFolder={"گشایش و ابلاغ"}
          />
        </div>

        <Button
          type="submit"
          className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
        >
          ثبت اطلاعات
        </Button>
      </form>

      <p className="text-red-600 text-center text-[16px] font-normal mt-4">
        * آپلود ابلاغیه مهر و امضادار اجباری میباشد.
      </p>
    </div>
  );
};

export default Openning;
