import React from "react";
import type { ISearchBarProps } from "@/utils/type";

const SearchBar: React.FC<ISearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="flex justify-end items-center flex-row max-w-[250px] rounded-xl bg-[#f3f3f3]">
      <input
        type="text"
        placeholder="جستجو"
        value={value}
        onChange={onChange}
        className="h-10 border-none w-full text-right pr-1 outline-none text-[18px] font-normal direction-rtl bg-[#f3f3f3] rounded-l-xl"
      />
      <svg
        className="rounded-r-xl px-1 bg-[#f3f3f3]"
        width="40"
        height="40"
        fill="#313131"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
    </div>
  );
};

export default SearchBar;
