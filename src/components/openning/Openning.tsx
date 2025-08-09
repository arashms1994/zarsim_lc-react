import { useRef, useState } from "react";
import { useLayoutContext } from "@/providers/LayoutContext";
import { useCustomerFactor } from "@/api/getData";
import { updateCustomerFactorItem } from "@/api/addData";
import SectionHeader from "../ui/SectionHeader";
import OpenningForm from "./openning-form/OpennigForm";
import type { OpenningFormSchema } from "@/utils/validation";
import type { IFileUploadRef } from "@/utils/type";
import { Bounce, toast } from "react-toastify";

const Openning = () => {
  const { faktorNumber } = useLayoutContext();
  const faktor = useCustomerFactor(faktorNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendRef = useRef<{ uploadFile: () => Promise<void> }>(
    null
  ) as React.RefObject<IFileUploadRef>;

  if (!faktorNumber) {
    return (
      <div className="mt-12 text-center text-red-500">
        شماره فاکتور یافت نشد
      </div>
    );
  }

  if (faktor.isLoading) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-2 text-base font-medium text-gray-800">
          در حال بارگذاری...
        </span>
      </div>
    );
  }

  if (faktor.error || !faktor.data) {
    return (
      <div className="mt-12 text-center text-red-500">
        خطا در بارگذاری داده‌های فاکتور:{" "}
        {faktor.error?.message || "داده‌ای یافت نشد"}
      </div>
    );
  }

  const handleFormSubmit = async (formData: OpenningFormSchema) => {
    setIsSubmitting(true);
    try {
      await updateCustomerFactorItem(faktorNumber, {
        LCNumber: String(formData.LCNumber),
        LCTotal: String(formData.LCTotal),
        tarikhmabnavalue: String(formData.tarikhmabnavalue),
        mabnavalue: String(formData.mabnavalue),
        tarikhgoshayesh: String(formData.tarikhgoshayesh),
        tarikheblagh: String(formData.tarikheblagh),
      });
      toast.success("اطلاعات با موفقیت ثبت شد!", {
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
      if (sendRef.current) {
        await sendRef.current.uploadFile();
      }
    } catch (error) {
      console.error("خطا در ثبت اطلاعات یا آپلود فایل:", error);
      toast.error("خطایی در ثبت اطلاعات رخ داد!", {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SectionHeader title="اطلاعات اعتبار اسنادی (ابلاغ)" />
      <OpenningForm
        onSubmit={handleFormSubmit}
        faktorData={faktor.data}
        fileRef={sendRef}
        faktorNumber={faktorNumber}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Openning;
