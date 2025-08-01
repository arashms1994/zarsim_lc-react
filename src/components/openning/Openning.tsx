import { useRef } from "react";
import { useLayoutContext } from "@/providers/LayoutContext";
import { useCustomerFactor } from "@/api/getData";
import { AddToOpenningDate } from "@/api/addData";
import SectionHeader from "../ui/SectionHeader";
import OpenningForm from "./openning-form/OpennigForm";

const Openning = () => {
  const sendRef = useRef<any>(null);
  const { faktorNumber } = useLayoutContext();
  const faktor = useCustomerFactor(faktorNumber);

  const handleFormSubmit = async (formData: any) => {
    if (sendRef.current && !sendRef.current.getFile()) {
      alert("لطفا فایل ابلاغیه را انتخاب کنید.");
      return;
    }

    try {
      await AddToOpenningDate(formData, faktorNumber);
      alert("اطلاعات با موفقیت ثبت شد.");

      if (sendRef.current) {
        await sendRef.current.uploadFile();
      }
    } catch (error) {
      console.error("خطا در ثبت اطلاعات یا آپلود فایل:", error);
      alert("خطایی در ثبت اطلاعات یا آپلود فایل رخ داد.");
    }
  };

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

  return (
    <div>
      <SectionHeader title="اطلاعات اعتبار اسنادی (ابلاغ)" />
      <OpenningForm
        onSubmit={handleFormSubmit}
        faktorData={faktor.data}
        fileRef={sendRef}
        faktorNumber={faktorNumber}
      />
    </div>
  );
};

export default Openning;
