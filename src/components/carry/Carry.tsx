import { useState } from "react";
import { Button } from "../ui/button";
import Slider from "./carry-slider/Slider";
import SectionHeader from "../ui/SectionHeader";
import { useLayoutContext } from "@/providers/LayoutContext";
import CarryForm from "./carry-form/CarryForm";
import { toast } from "react-toastify";
import type { CarryFormSchema } from "@/utils/validation";
import { addCarryReceipt } from "@/api/addData";
import { useCustomerFactor } from "@/api/getData";
import Guid from "@/utils/createGUID";

const Carry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCarryFormModalOpen, setCarryFormModalOpen] = useState(false);

  const { faktorNumber } = useLayoutContext();
  const faktor = useCustomerFactor(faktorNumber);

  if (faktor.isLoading)
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-2 text-base font-medium text-gray-800">
          در حال بارگذاری...
        </span>
      </div>
    );

  if (faktor.error) return <div>خطا در بارگذاری اطلاعات</div>;

  const LCNumber = faktor.data?.LCNumber;
  console.log(LCNumber);

  const handleFormSubmit = async (formData: CarryFormSchema) => {
    setIsSubmitting(true);
    try {
      await addCarryReceipt({
        Count: String(formData.Count),
        Total: String(formData.Total),
        Title: String(formData.Title),
        Date: String(formData.Date),
        Order_Number: faktorNumber,
        Status: "0",
        Bank_Confirm: "0",
        GUID: Guid(),
        LC_Number: LCNumber || "",
      });
      toast.success("اطلاعات با موفقیت ثبت شد.");
    } catch (error) {
      console.error("خطا در ثبت اطلاعات یا آپلود فایل:", error);
      toast.error("خطایی در ثبت اطلاعات یا آپلود فایل رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div>
        <SectionHeader title="حمل و پرداخت" />
      </div>

      <button
        type="button"
        onClick={() => {
          if (!isCarryFormModalOpen) setIsModalOpen(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        تکمیل اطلاعات مرحله حمل
      </button>

      <button
        type="button"
        onClick={() => {
          if (!isModalOpen) setCarryFormModalOpen(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        افزودن مرحله حمل
      </button>

      {isModalOpen && (
        <div className="mx-auto my-auto w-full h-full fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg relative  w-[1200px] h-[680px] ">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="min-w-0 gap-0 w-7 h-7 botder-none flex justify-center items-center text-center absolute bg-red-600 p-1 top-2 left-2 text-white text-xl rounded-full hover:bg-slate-100 hover:text-red-600 transition-all duration-300"
            >
              X
            </Button>

            <Slider faktorNumber={faktorNumber} />
          </div>
        </div>
      )}

      {isCarryFormModalOpen && (
        <div className="mx-auto my-auto w-full h-full fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg relative  w-[1200px] h-[680px] ">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCarryFormModalOpen(false)}
              className="min-w-0 gap-0 w-7 h-7 border-none flex justify-center items-center text-center absolute bg-red-600 p-1 top-2 left-2 text-white text-xl rounded-full hover:bg-slate-100 hover:text-red-600 transition-all duration-300"
            >
              X
            </Button>

            <CarryForm
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carry;
