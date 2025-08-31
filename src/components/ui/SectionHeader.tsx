import React from "react";
import type { ISectionHeaderProps } from "@/utils/type";

const SectionHeader: React.FC<ISectionHeaderProps> = ({ title, className }) => {
  return (
    <div
      className={`rounded-lg px-5 py-2.5 m-5 bg-[#dddFC9] text-[#0e7216] text-center flex justify-center items-center ${
        className ?? ""
      }`}
    >
      <span className={`text-2xl text-[#0e7216] ${className ?? ""}`}>
        {title}
      </span>
    </div>
  );
};

export default SectionHeader;
