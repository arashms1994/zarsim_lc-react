import { useState } from "react";
import { Button } from "../ui/button";
import Slider from "./carry-slider/Slider";
import SectionHeader from "../ui/SectionHeader";
import { useLayoutContext } from "@/providers/LayoutContext";
import CarryForm from "./carry-form/CarryForm";
import { toast } from "react-toastify";
import type { CarryFormSchema } from "@/utils/validation";
import { addCarryReceipt } from "@/api/addData";
import { useCarryReceipts, useCustomerFactor } from "@/api/getData";
import Guid from "@/utils/createGUID";
import CarryTable from "./carry-table/CarryTable";
import type { ICarryReceipt } from "@/utils/type";

const Carry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCarryFormModalOpen, setCarryFormModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ICarryReceipt | null>(null); // state جدید برای آیتم انتخاب‌شده
  const GUID = Guid();

  const { faktorNumber } = useLayoutContext();
  const {
    data: faktor,
    isError: faktorError,
    isLoading: faktorLoading,
  } = useCustomerFactor(faktorNumber);
  const {
    data: carryReceipt,
    isLoading: carryReceiptLoading,
    isError: carryReceiptError,
  } = useCarryReceipts(faktorNumber);

  if (faktorLoading || carryReceiptLoading)
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-2 text-base font-medium text-gray-800">
          در حال بارگذاری...
        </span>
      </div>
    );

  if (faktorError || carryReceiptError)
    return <div>خطا در بارگذاری اطلاعات</div>;

  const LCNumber = faktor?.LCNumber;

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
        GUID: GUID,
        LC_Number: LCNumber || "",
      });
      toast.success("اطلاعات با موفقیت ثبت شد.");
      setCarryFormModalOpen(false);
    } catch (error) {
      console.error("خطا در ثبت اطلاعات یا آپلود فایل:", error);
      toast.error("خطایی در ثبت اطلاعات یا آپلود فایل رخ داد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptClick = (receipt: ICarryReceipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div>
        <SectionHeader title="حمل و پرداخت" />
      </div>

      <button
        type="button"
        onClick={() => {
          if (!isModalOpen) setCarryFormModalOpen(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        افزودن مرحله حمل
      </button>

      <CarryTable carryReceipt={carryReceipt ?? []} onReceiptClick={handleReceiptClick} />

      {isModalOpen && (
        <div className="mx-auto my-auto w-full h-full fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[1200px] h-[680px]">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedReceipt(null);
              }}
              className="min-w-0 gap-0 w-7 h-7 border-none flex justify-center items-center text-center absolute bg-red-600 p-1 top-2 left-2 text-white text-xl rounded-full hover:bg-slate-100 hover:text-red-600 transition-all duration-300"
            >
              X
            </Button>

            <Slider faktorNumber={faktorNumber} selectedReceipt={selectedReceipt} />
          </div>
        </div>
      )}

      {isCarryFormModalOpen && (
        <div className="mx-auto my-auto w-full h-full fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[500px] h-[500px]">
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