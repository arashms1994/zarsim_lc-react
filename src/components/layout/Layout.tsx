import React, { useState, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutContext } from "@/providers/LayoutContext";

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [faktorNumber, setFaktorNumber] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const faktor = params.get("Factor_ID") ?? "";
    if (faktor !== faktorNumber) {
      setFaktorNumber(faktor);
    }
  }, [location.search, faktorNumber]);

  const getActiveTab = () => {
    switch (location.pathname) {
      case "/":
        return "preinvoice";
      case "/openning":
        return "openning";
      case "/carry":
        return "carry";
      case "/payment":
        return "payment";
      default:
        return "preinvoice";
    }
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    let targetPath = "/";
    if (value === "openning") targetPath = "/openning";
    else if (value === "carry") targetPath = "/carry";
    else if (value === "payment") targetPath = "/payment";
    navigate(`${targetPath}?${params.toString()}`);
  };

  return (
    <LayoutContext.Provider value={{ faktorNumber }}>
      <div className="flex flex-col justify-center items-center rtl">
        <header className="bg-[#dddFC9] w-full m-w-[1200px] p-5 md:p-5 text-[#cacaca] rounded-[40px] text-right">
          <Tabs
            value={getActiveTab()}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="flex flex-row-reverse justify-around bg-transparent">
              <TabsTrigger
                value="preinvoice"
                className="text-xl border-none font-medium transition-all duration-300 px-4 py-2 rounded-full data-[state=active]:bg-[#009E08] data-[state=active]:text-white data-[state=inactive]:bg-[#c5c5c5] data-[state=inactive]:text-[#e7e7e7] hover:bg-[#445861] hover:text-white"
              >
                اطلاعات پیش فاکتور
              </TabsTrigger>
              <TabsTrigger
                value="openning"
                className="text-xl border-none font-medium transition-all duration-300 px-4 py-2 rounded-full data-[state=active]:bg-[#009E08] data-[state=active]:text-white data-[state=inactive]:bg-[#c5c5c5] data-[state=inactive]:text-[#e7e7e7] hover:bg-[#445861] hover:text-white"
              >
                اطلاعات اعتبار اسنادی (ابلاغ)
              </TabsTrigger>
              <TabsTrigger
                value="carry"
                className="text-xl border-none font-medium transition-all duration-300 px-4 py-2 rounded-full data-[state=active]:bg-[#009E08] data-[state=active]:text-white data-[state=inactive]:bg-[#c5c5c5] data-[state=inactive]:text-[#e7e7e7] hover:bg-[#445861] hover:text-white"
              >
                حمل و پرداخت
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="text-xl border-none font-medium transition-all duration-300 px-4 py-2 rounded-full data-[state=active]:bg-[#009E08] data-[state=active]:text-white data-[state=inactive]:bg-[#c5c5c5] data-[state=inactive]:text-[#e7e7e7] hover:bg-[#445861] hover:text-white"
              >
                اختتامیه اعتبار اسنادی
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        <main>
          <Outlet context={{ faktorNumber }} />
        </main>
      </div>
    </LayoutContext.Provider>
  );
};
