import { useCustomerFactor } from "../../api/getData";
import Faktor from "./Faktor";
import { useOutletContext } from "react-router";

const PreInvoice = () => {
  const { faktorNumber } = useOutletContext<{ faktorNumber: string }>();

  const {
    data: customer,
    isLoading: customerLoading,
  } = useCustomerFactor(faktorNumber);

  if (customerLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div dir="rtl" className="w-full flex justify-center items-center flex-col">
      {customer && <Faktor customer={customer} />}
    </div>
  );
};

export default PreInvoice;
