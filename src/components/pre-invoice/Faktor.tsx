import React from "react";
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";
import { Link } from "react-router";
import type { IFaktorProps } from "@/utils/type";

const Faktor: React.FC<IFaktorProps> = ({ customer }) => {
  const customerDetails = [
    { label: "شماره پیش فاکتور:", value: customer.Title },
    { label: "تاریخ ثبت پیش فاکتور:", value: customer.Date },
    { label: "نام مشتری:", value: customer.Customer },
    { label: "نوع پیش فاکتور:", value: customer.type_factor },
    { label: "مجموع مس (CU):", value: customer.MainTotalCu },
    { label: "مجموع مس-قلع (TICU):", value: customer.MainTotakTICU },
    { label: "جمع کل (ريال):", value: customer.total_SUM },
    {
      label: "تخفیف (ريال):",
      value: formatNumberWithComma(customer.takhfif),
    },
    {
      label: "عوارض و مالیات (ريال):",
      value: formatNumberWithComma(customer.avarez),
    },
    {
      label: "مبلغ کل (ريال):",
      value: formatNumberWithComma(customer.total_mani),
    },
  ];

  if (!customer || Object.keys(customer).length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-2 text-base font-medium text-gray-800">
          در حال بارگذاری...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center px-5 pt-5 relative">
      <div className="w-[650px] flex justify-between items-center flex-wrap gap-10 pt-2.5">
        <Link
          className="flex justify-between items-center text-center"
          to={`http://portal/Lists/customer_factor/DispForm.aspx?ID=${customer.ID}`}
        >
          <div className="absolute -top-16 -right-24 p-3 flex justify-center items-center rounded-xl bg-blue-700 cursor-pointer hover:bg-blue-300 transition-all duration-300">
            <span className="text-white text-base font-normal">
              مشاهده کامل پیش فاکتور
            </span>
          </div>
        </Link>

        {customerDetails.map((item, index) => (
          <div
            key={index}
            className="p-3 flex justify-start items-center flex-row gap-1 shadow-md border-gray-400"
          >
            <span className="text-gray-500 text-sm font-medium">
              {item.label}
            </span>
            <span className="text-gray-700 text-2xl font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faktor;
