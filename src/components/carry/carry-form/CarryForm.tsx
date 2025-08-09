import { useForm } from "react-hook-form";
import { CarryFormSchema } from "@/utils/validation";
import PersianDatePicker from "@/components/persian-date-picker/PersianDatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ICarryForm } from "@/utils/type";
import SectionHeader from "@/components/ui/SectionHeader";

const CarryForm = ({ onSubmit, isSubmitting }: ICarryForm) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CarryFormSchema>({
    resolver: zodResolver(CarryFormSchema),
  });

  return (
    <div className="w-full flex flex-col justify-between items-center gap-5 my-5">
      <SectionHeader title="ثبت مرحله حمل (فاکتور از مالی)" />

      <form
        className="flex flex-col justify-center items-center gap-5 py-5"
        onSubmit={(e) => {
          handleSubmit((data) => {
            onSubmit(data);
          })(e);
        }}
      >
        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">شماره فاکتور:</label>

          <input
            className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
            {...register("Title")}
          />
          {errors.Title && (
            <p className="text-red-500 text-sm">{errors.Title.message}</p>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">تاریخ فاکتور:</label>
          <PersianDatePicker
            value={watch("Date") || null}
            onChange={(date) => setValue("Date", date)}
          />

          {errors.Date && (
            <p className="text-red-500 text-sm">{errors.Date.message}</p>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مجموع متراژ: </label>

          <input
            className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
            {...register("Count")}
          />
          {errors.Count && (
            <p className="text-red-500 text-sm">{errors.Count.message}</p>
          )}
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center gap-5">
          <label className="text-[22px] font-medium">مبلغ کل(ریال):</label>

          <input
            className="w-[230px] min-h-[30px] px-1 py-[2px] text-[18px] font-normal text-gray-700 rounded-lg border-2 border-[#ababab]"
            {...register("Total")}
          />
          {errors.Total && (
            <p className="text-red-500 text-sm">{errors.Total.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت اطلاعات"}
        </button>
      </form>
    </div>
  );
};

export default CarryForm;
