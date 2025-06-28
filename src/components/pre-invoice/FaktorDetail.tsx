import type { IFaktorDetailProps } from "../../utils/Type";

export default function FaktorDetail({ products = [] }: IFaktorDetailProps) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-600">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center px-5 pt-5">
      <div className="rounded-lg px-5 py-2 bg-[#dddFC9] text-green-700 mb-4">
        <h1 className="text-xl font-bold">جزئیات پیش فاکتور</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="py-2 px-3">ردیف</th>
              <th className="py-2 px-3">شرح محصول</th>
              <th className="py-2 px-3">رنگ</th>
              <th className="py-2 px-3">دسته بندی</th>
              <th className="py-2 px-3">بسته بندی</th>
              <th className="py-2 px-3">قیمت واحد</th>
              <th className="py-2 px-3">بهای کالا</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className="even:bg-gray-100">
                <td className="py-2 px-3">{i + 1}</td>
                <td className="py-2 px-3">{p.Title}</td>
                <td className="py-2 px-3">{p.colertitle}</td>
                <td className="py-2 px-3">{p.Category}</td>
                <td className="py-2 px-3">{p.Packing}</td>
                <td className="py-2 px-3">{p.Price}</td>
                <td className="py-2 px-3">{p.Value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
