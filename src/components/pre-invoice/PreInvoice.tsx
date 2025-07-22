import Faktor from "./Faktor";
import SectionHeader from "../ui/SectionHeader";
import { useCustomerFactor } from "../../api/getData";
import { useLayoutContext } from "@/providers/LayoutContext";

const PreInvoice = () => {
  const { faktorNumber } = useLayoutContext();

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
