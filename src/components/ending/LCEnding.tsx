import { useCustomerFactor } from "@/api/getData";
import SectionHeader from "../ui/SectionHeader";
import { useLayoutContext } from "@/providers/LayoutContext";
import { updateLCEnding } from "@/api/addData";
import { useState } from "react";
import { toast } from "react-toastify";
import { TOAST_CONFIG } from "@/utils/constants";
import { generateNamehEkhtetamieh } from "@/utils/generateNamehEkhtetamieh";

const LCEnding = () => {
  const { faktorNumber } = useLayoutContext();
  const { data: faktor } = useCustomerFactor(faktorNumber);
  const [isLoading, setIsLoading] = useState(false);

  const handleLCEnding = async () => {
    console.log("شروع handleLCEnding", { faktorNumber, faktor });

    setIsLoading(true);

    if (!faktor) {
      console.error("خطا: داده‌های فاکتور در دسترس نیست", { faktorNumber });
      toast.error("داده‌های فاکتور در دسترس نیست!", TOAST_CONFIG);
      setIsLoading(false);
      return;
    }

    try {
      console.log("مرحله 1: به‌روزرسانی وضعیت اختتام");
      const result = await updateLCEnding(faktorNumber);
      console.log("وضعیت اختتام با موفقیت به‌روزرسانی شد", { result });

      if (!result.success) {
        throw new Error(result.message);
      }

      console.log("مرحله 2: تولید فایل Word");
      await generateNamehEkhtetamieh({
        BankAccountvalue: faktor.BankAccountvalue || "نامشخص",
        LCNumber: faktor.LCNumber || "نامشخص",
        Customer: faktor.Customer || "نامشخص",
      });
      console.log("فایل Word با موفقیت تولید شد");

      toast.success(
        `${result.message} و فایل Word تولید شد!`,
        TOAST_CONFIG
      );
    } catch (error) {
      console.error("خطا در handleLCEnding:", error);
      toast.error(`خطا در ثبت اختتام یا تولید فایل Word: ${error}`, TOAST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="اختتامیه اعتبار اسنادی" />
      {faktor?.LCEnding === "" || faktor?.LCEnding === "0" ? (
        <div className="flex justify-center items-center py-5">
          <button
            type="submit"
            className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
              ${isLoading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-900"}`}
            onClick={handleLCEnding}
            disabled={isLoading}
          >
            ثبت اختتامیه اعتبار اسنادی
          </button>
        </div>
      ) : (
        <SectionHeader
          title={`اعتبار اسنادی با شماره ${faktor?.LCNumber} پایان یافته است.`}
        />
      )}
    </div>
  );
};

export default LCEnding;