import type { FaktorProps } from "../../utils/Type";

export default function Faktor({ customer }: FaktorProps) {
  if (!customer || !customer.item) {
    return <div className="text-center text-gray-600">در حال بارگذاری...</div>;
  }

  const { Title, Date, Customer: CustomerName, type_factor } = customer.item;

  return (
    <div className="flex flex-col justify-center items-center px-5 pt-5">
      <div className="rounded-lg px-5 py-2 bg-[#dddFC9] text-green-700">
        <h1 className="text-xl font-bold">مشخصات مشتری</h1>
      </div>

      <div className="w-full flex justify-between items-center flex-wrap gap-8 px-8 pt-4">
        <div className="flex justify-center items-center gap-2">
          <p className="text-gray-600 text-base font-medium">
            شماره پیش فاکتور:
          </p>
          <p className="text-gray-800 text-xl font-semibold">{Title}</p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <p className="text-gray-600 text-base font-medium">
            تاریخ ثبت پیش فاکتور:
          </p>
          <p className="text-gray-800 text-xl font-semibold">{Date}</p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <p className="text-gray-600 text-base font-medium">نام مشتری:</p>
          <p className="text-gray-800 text-xl font-semibold">{CustomerName}</p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <p className="text-gray-600 text-base font-medium">نوع پیش فاکتور:</p>
          <p className="text-gray-800 text-xl font-semibold">{type_factor}</p>
        </div>
      </div>
    </div>
  );
}
