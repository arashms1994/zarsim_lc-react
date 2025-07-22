import { useState } from "react";
import CarryForm from "./CarryForm";
import { Button } from "../ui/button";
import Slider from "./carry-slider/Slider";
import SectionHeader from "../ui/SectionHeader";
import { useLayoutContext } from "@/providers/LayoutContext";

const Carry = () => {
  const { faktorNumber } = useLayoutContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div>
        <SectionHeader title="حمل و پرداخت" />
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        افزودن مرحله حمل
      </button>

      {isModalOpen && (
        <div className="mx-auto my-auto w-full h-full fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg relative  w-[1200px] h-[800px] ">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="min-w-0 gap-0 w-7 h-7 botder-none flex justify-center items-center text-center absolute bg-red-600 p-1 top-2 left-2 text-white text-xl rounded-full hover:bg-slate-100 hover:text-red-600 transition-all duration-300"
            >
              X
            </Button>

            <Slider faktorNumber={faktorNumber}/>
          </div>
        </div>
      )}
      <CarryForm faktorNumber={faktorNumber} />
    </div>
  );
};

export default Carry;
