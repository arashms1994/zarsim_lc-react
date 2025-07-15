import React from "react";
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";
import { Link } from "react-router";
import type { IFaktorProps } from "@/utils/type";

const Faktor: React.FC<IFaktorProps> = ({ customer }) => {
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

  return (
    <div className="flex flex-col justify-center items-center px-5 pt-5 relative">
      <div className="rounded-lg px-5 py-2.5 mb-5 bg-[#dddFC9] text-[#0e7216]">
        <p className="text-2xl text-[#0e7216]">مشخصات مشتری</p>
      </div>

      <div className="w-full flex justify-start items-center flex-wrap gap-8 px-8 pt-2.5">
        <Link
          className="flex justify-center items-center text-center"
          to={`http://portal/Lists/customer_factor/DispForm.aspx?ID=${customer.ID}`}
        >
          <div className="absolute top-5 right-0 p-2 flex justify-center items-center rounded-xl bg-blue-700 cursor-pointer">
            <p className="text-white text-base font-normal">
              مشاهده کامل پیش فاکتور
            </p>
          </div>
        </Link>

        {customerDetails.map((item, index) => (
          <div
            key={index}
            className="p-1 flex justify-center items-center flex-row gap-1 border-b border-gray-400"
          >
            <p className="text-gray-500 text-sm font-medium">{item.label}</p>
            <p className="text-gray-700 text-2xl font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faktor;
