import { useCustomerFactor, useCustomerFactorDetails } from "../../api/getData";
import Faktor from "./Faktor";
import { useOutletContext } from "react-router";
import FaktorDetail from "./FaktorDetail";

const PreInvoice = () => {
  const { faktorNumber } = useOutletContext<{ faktorNumber: string }>();

  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useCustomerFactor(faktorNumber);
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useCustomerFactorDetails(faktorNumber);

  if (customerLoading || productsLoading) return <div>در حال بارگذاری...</div>;
  if (customerError || productsError) return <div>خطا در بارگذاری داده‌ها</div>;

  return (
    <div dir="rtl" className="w-full flex justify-center items-center flex-col">
      <Faktor customer={customer} />
      <FaktorDetail products={products} />
    </div>
  );
};

export default PreInvoice;
