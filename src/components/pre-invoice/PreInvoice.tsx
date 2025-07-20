import type { ContextType } from "@/utils/type";
import { useCustomerFactor } from "../../api/getData";
import Faktor from "./Faktor";
import { useOutletContext } from "react-router";
import SectionHeader from "../ui/SectionHeader";

const PreInvoice = () => {
  const { faktorNumber } = useOutletContext<ContextType>();

  const { data: customer, isLoading: customerLoading } =
    useCustomerFactor(faktorNumber);

  if (customerLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div dir="rtl" className="w-full flex justify-center items-center flex-col">
      <div>
        <SectionHeader title="مشخصات مشتری" />
      </div>

      {customer && <Faktor customer={customer} />}
    </div>
  );
};

export default PreInvoice;
