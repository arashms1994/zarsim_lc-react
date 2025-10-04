import { Bounce } from "react-toastify";

export const LC_OPENNING_DATES = [
  { value: "از تاریخ گشایش", label: "از تاریخ گشایش" },
  { value: "از تاریخ ابلاغ", label: "از تاریخ ابلاغ" },
  { value: "از تاریخ حمل/بارنامه", label: "از تاریخ حمل/بارنامه" },
  { value: "از تاریخ فاکتور", label: "از تاریخ فاکتور" },
  {
    value: "از تاریخ ارائه اسناد به بانک/ معامله اسناد/ رسید دریافت بانک",
    label: "از تاریخ ارائه اسناد به بانک/ معامله اسناد/ رسید دریافت بانک",
  },
];

export const LC_SETTLEMENT_DATES = [
  { value: "30", label: "30" },
  { value: "45", label: "45" },
  { value: "60", label: "60" },
  { value: "75", label: "75" },
  { value: "90", label: "90" },
  { value: "120", label: "120" },
  { value: "180", label: "180" },
];

export const LC_VALIDATION_DATES = [
  { value: "30", label: "30" },
  { value: "45", label: "45" },
  { value: "60", label: "60" },
  { value: "75", label: "75" },
  { value: "90", label: "90" },
  { value: "120", label: "120" },
  { value: "180", label: "180" },
];

export const FIRST_SLIDE_DOCS = [
  { label: "فاکتور فروش", value: "faktor" },
  { label: "بارنامه", value: "barnameh" },
  { label: "برگه باسکول", value: "baskool" },
];

export const FIRST_SLIDE_DOCS_VERSION2 = [
  { label: "فاکتور فروش اصلاحیه", value: "faktor2" },
  { label: "بارنامه اصلاحیه", value: "barnameh2" },
  { label: "برگه باسکول اصلاحیه", value: "baskool2" },
];

export const SECOND_SLIDE_DOCS = [
  { label: "پکینگ", value: "packing" },
  { label: "گواهی بازرسی", value: "govahibazrasi" },
  { label: "صورت مجلس تحویل و تحول", value: "tahvilotahavol" },
];

export const SECOND_SLIDE_DOCS_VERSION2 = [
  { label: "پکینگ اصلاحیه", value: "packing2" },
  { label: "گواهی بازرسی اصلاحیه", value: "govahibazrasi2" },
  { label: "صورت مجلس تحویل و تحول اصلاحیه", value: "tahvilotahavol2" },
];

export const TOAST_CONFIG = {
  position: "top-center" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as const,
  transition: Bounce,
};

export const MODAL_CLASSES = {
  overlay:
    "mx-auto my-auto w-full h-full fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto",
  container: "bg-white p-6 rounded-lg shadow-lg relative",
  closeButton:
    "min-w-0 gap-0 w-7 h-7 border-none flex justify-center items-center text-center absolute bg-red-600 p-1 top-2 left-2 text-white text-xl rounded-full hover:bg-slate-100 hover:text-red-600 transition-all duration-300",
};
