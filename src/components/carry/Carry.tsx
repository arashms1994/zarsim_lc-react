import CarryForm from "./CarryForm";
import type { ContextType } from "@/utils/type";
import { useOutletContext } from "react-router";

const Carry = () => {
  const { faktorNumber } = useOutletContext<ContextType>();

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <CarryForm faktorNumber={faktorNumber} />
    </div>
  );
};

export default Carry;
