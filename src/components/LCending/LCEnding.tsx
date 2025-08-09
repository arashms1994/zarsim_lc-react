import { useCustomerFactor } from "@/api/getData";
import SectionHeader from "../ui/SectionHeader";
import { useLayoutContext } from "@/providers/LayoutContext";
import { updateLCEnding } from "@/api/addData";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

const LCEnding = () => {
  const { faktorNumber } = useLayoutContext();
  const { data: faktor } = useCustomerFactor(faktorNumber);
  const [isLoading, setIsLoading] = useState(false);

  const handleLCEnding = async () => {
    setIsLoading(true);
    const result = await updateLCEnding(faktorNumber);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message, {
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
    } else {
      toast.error(result.message, {
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
    }
  };

  return (
    <div>
      <SectionHeader title="اختتامیه اعتبار اسنادی" />
      {faktor?.LCEnding === "" || faktor?.LCEnding === "0" ? (
        <div className="flex justify-center items-center py-5">
          <button
            type="submit"
            className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
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
