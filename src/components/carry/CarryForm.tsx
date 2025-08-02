import React, { useState, useEffect } from "react";
import { addToCarryReceipt } from "../../api/addData";
import { formatNumberWithComma } from "../../utils/formatNumberWithComma";
import { useExitRequestsByOrderNumber, useLCNumberAndTotalPrice } from "@/api/getData";
import { calculateExitSummary } from "@/utils/exitSummary";

const CarryForm = ({ faktorNumber }: { faktorNumber: string }) => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: string }>(
    {}
  );
  const [lcNumber] = useState("");
  const [exitRequests, setExitRequests] = useState<any[]>([]);
  const [totalMablagh, setTotalMablagh] = useState(0);
  const [totalMetraj, setTotalMetraj] = useState(0);

  const exitRequestsQuery = useExitRequestsByOrderNumber(faktorNumber);
  useLCNumberAndTotalPrice(faktorNumber);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      for (const product of selectedProducts) {
        const countStr = productCounts[product.Product] || "0";
        const count = parseFloat(countStr);
        const price = parseFloat(product.Price);

        if (isNaN(count) || count <= 0) continue;
        if (isNaN(price) || price <= 0) {
          console.warn(`قیمت محصول ${product.Title} نامعتبر است`);
          continue;
        }

        await addToCarryReceipt({
          Title: product.Title,
          GUID: localStorage.getItem("GUID") || "",
          TotalPrice: price * count,
          LCNumber: lcNumber,
          Price: price,
          Count: count,
        });
      }
      alert("اطلاعات با موفقیت ثبت شد.");
      setSelectedProducts([]);
      setProductCounts({});
      localStorage.removeItem("GUID");
    } catch (error) {
      console.error("خطا در ثبت اطلاعات:", error);
      alert("خطایی در ثبت اطلاعات رخ داد.");
    }
  };

  useEffect(() => {
    const exitRequests = exitRequestsQuery.data || [];
    const summary = calculateExitSummary(exitRequests);
    setExitRequests(exitRequests);
    setTotalMetraj(summary.totalMetraj);
    setTotalMablagh(summary.totalMablagh);
  }, [faktorNumber, exitRequestsQuery.data]);

  if (!exitRequests || exitRequests.length === 0) {
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
    <div className="flex flex-col justify-center items-center gap-5">
      <form
        className="w-full mt-5 flex flex-col justify-center items-center gap-5 py-10 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="p-2 w-full flex flex-col items-center gap-2 justify-center">
          <div className="w-full p-3 rounded-xl">
            <div className="flex flex-col justify-center items-center gap-2">
              {exitRequests.map((item) => (
                <div
                  key={item.ID}
                  className="flex justify-center items-center gap-2"
                >
                  <p className="text-[18px] font-medium">{item.goodsname}</p>
                  <p className="text-[18px] font-medium">
                    <span className="text-[18px] font-medium">متر:</span>
                    {item.metrajdarkhast}
                  </p>
                  <p className="text-[18px] font-medium">
                    <span className="text-[18px] font-medium">ریال:</span>
                    {item.date_k}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex justify-center items-center gap-2">
              <p className="text-[18px] font-medium">
                <span className="text-[18px] font-medium">مجموع متراژ:</span>
                {totalMetraj}
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="text-[18px] font-medium">
                <span className="text-[18px] font-medium">مبلغ کل (ريال):</span>
                {formatNumberWithComma(totalMablagh)}
              </p>
            </div>
          </div>
          <div className="w-full flex gap-10 justify-center items-center">
            <button
              type="submit"
              className="border-none rounded-lg min-w-[200px] p-2 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
            >
              ثبت اطلاعات رسید حمل
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CarryForm;
