import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import type { IPersianDatePickerProps } from "@/utils/type";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarSearch } from "lucide-react";

const PersianDatePicker: React.FC<IPersianDatePickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-full max-w-[230px] min-h-[34px] border-2 border-[#ababab] rounded-lg flex items-center justify-between pl-2">
      <DatePicker
        value={value}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        format="YYYY/MM/DD"
        render={
          <input
            placeholder="تاریخ را انتخاب کنید"
            className="w-full h-full px-2 text-right outline-none text-gray-700"
          />
        }
        onChange={(date) => {
          if (date) {
            onChange(date.format("YYYY/MM/DD"));
          }
        }}
      />
      <CalendarSearch />
    </div>
  );
};

export default PersianDatePicker;
