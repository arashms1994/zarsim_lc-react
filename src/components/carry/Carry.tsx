import CarryForm from "./CarryForm";
import type { ContextType } from "@/utils/type";
import { useOutletContext } from "react-router";

const Carry = () => {
  const { faktorNumber } = useOutletContext<ContextType>();

  if (!faktorNumber || faktorNumber.length === 0) {
    return <div className="mt-12 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <CarryForm faktorNumber={faktorNumber} />
    </div>
  );
};

export default Carry;
