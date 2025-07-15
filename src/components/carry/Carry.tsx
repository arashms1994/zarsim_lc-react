import React from "react";
import CarryForm from "./CarryForm";
import type { ICarryProps } from "@/utils/type";

const Carry: React.FC<ICarryProps> = ({ faktorNumber }) => {
//   const [faktorNumber, setFaktorNumber] = useState<string>("");

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const faktorNumberParam = params.get("Factor_ID") || "4-70105-1";
//     setFaktorNumber(faktorNumberParam);
//   }, []);

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