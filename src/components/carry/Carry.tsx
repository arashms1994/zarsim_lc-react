import { useState } from "react";
import CarryForm from "./CarryForm";
import type { ContextType } from "@/utils/type";
import { useOutletContext } from "react-router";
import Slider from "./carry-slider/Slider";
import SectionHeader from "../ui/SectionHeader";

const Carry = () => {
  const { faktorNumber } = useOutletContext<ContextType>();
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md max-h-[600px] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2 text-red-600 text-xl"
            >
              ×
            </button>
            <Slider />
          </div>
        </div>
      )}
      <CarryForm faktorNumber={faktorNumber} />
    </div>
  );
};

export default Carry;
