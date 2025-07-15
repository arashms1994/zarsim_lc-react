import React, { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import classNames from "classnames";

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [faktorNumber, setFaktorNumber] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const faktor = params.get("Factor_ID") || "4-70105-1";
    setFaktorNumber(faktor);
  }, [location.search]);

  const getButtonClass = (targetPath: string) =>
    classNames(
      "text-[20px] font-medium cursor-pointer transition-all duration-300 p-3 md:p-4 rounded-[12px] flex justify-center items-center border-none",
      location.pathname === targetPath
        ? "bg-[#009E08] text-white"
        : "bg-[#c5c5c5] text-[#e7e7e7] hover:bg-[#445861] hover:text-white"
    );

  return (
    <div className="flex flex-col justify-center items-center p-5 md:p-10 rtl">
      <header className="bg-[#dddFC9] w-full max-w-[900px] p-5 md:p-10 text-[#cacaca] rounded-[40px] text-right flex items-center justify-around">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={getButtonClass("/")}
        >
          نمایش پیش فاکتور
        </button>

        <button
          type="button"
          onClick={() => navigate("/openning")}
          className={getButtonClass("/openning")}
        >
          گشایش و ابلاغ
        </button>

        <button
          type="button"
          onClick={() => navigate("/carry")}
          className={getButtonClass("/carry")}
        >
          حمل و بارگیری
        </button>

        <button
          type="button"
          onClick={() => navigate("/payment")}
          className={getButtonClass("/payment")}
        >
          پیگیری تعهد پرداخت
        </button>
      </header>

      <main>
        <Outlet context={{ faktorNumber }} />
      </main>
    </div>
  );
};
