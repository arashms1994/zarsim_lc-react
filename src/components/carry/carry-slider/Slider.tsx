import React, { useState } from "react";
import Slide1 from "./Slide1";
import Slide2 from "./Slide2";
import Slide3 from "./Slide3";
import Slide4 from "./Slide4";
import Slide5 from "./Slide5";
import Slide6 from "./Slide6";
import type { ICarrySliderProps } from "@/utils/type";

const Slider: React.FC<ICarrySliderProps> = ({
  faktorNumber,
  selectedReceipts,
  carryPhaseGUID,
}) => {
  const [page, setPage] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>(
    {}
  );

  const tabs = [
    { id: 1, label: "حمل" },
    { id: 2, label: "آماده‌سازی اسناد" },
    { id: 3, label: "ارسال اسناد به بانک" },
    { id: 4, label: "رسید بانک" },
    { id: 5, label: "تأیید اسناد" },
    { id: 6, label: "واریز مبلغ" },
  ];

  const renderSlide = () => {
    const slideProps = {
      setPage,
      faktorNumber,
      carryPhaseGUID,
      uploadedFiles,
      setUploadedFiles,
      selectedReceipts,
    };

    switch (page) {
      case 1:
        return <Slide1 {...slideProps} />;
      case 2:
        return <Slide2 {...slideProps} />;
      case 3:
        return <Slide3 {...slideProps} />;
      case 4:
        return <Slide4 {...slideProps} />;
      case 5:
        return <Slide5 {...slideProps} />;
      case 6:
        return <Slide6 {...slideProps} />;
      default:
        return (
          <div className="text-center text-gray-500">
            هیچ اسلایدی انتخاب نشده است
          </div>
        );
    }
  };

  console.log(selectedReceipts);
  return (
    <div className="my-auto mx-auto flex flex-col justify-center items-center p-5 md:p-10 rtl">
      <header className="bg-[#dddFC9] w-full p-5 md:p-5 text-[#cacaca] rounded-[40px] text-right flex items-center justify-around mb-6">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            <button
              type="button"
              onClick={() => setPage(tab.id)}
              className={`text-[20px] min-w-[140px] min-h-24 font-medium cursor-pointer transition-all duration-300 p-1 rounded-full flex justify-center items-center border-none ${
                page === tab.id
                  ? "bg-[#009E08] text-white"
                  : "bg-[#c5c5c5] text-[#e7e7e7] hover:bg-[#445861] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
            {index < tabs.length - 1 && (
              <div className="w-24 h-[2px] bg-muted-foreground"></div>
            )}
          </React.Fragment>
        ))}
      </header>

      <main className="w-full max-w-3xl">{renderSlide()}</main>
    </div>
  );
};

export default Slider;
