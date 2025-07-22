import type { ReactNode } from "react";
import type { DateObject } from "react-multi-date-picker";

export interface LayoutContextType {
  searchQuery?: string;
  faktorNumber: string;
}

export interface IOpenningState {
  LCTotalPrice: number;
  LCNumber: string;
  LCOpenningDate: string;
  LCCommunicationDate: string;
  LCSettlementDate: string;
  LCOriginOpenningDate: string;
}

export interface ICarryProps {
  faktorNumber: string;
}

export interface ICustomer {
  ID: number;
  Title: string;
  Date: string;
  Customer: string;
  type_factor: string;
  MainTotalCu: number;
  MainTotakTICU: number;
  total_SUM: number;
  takhfif: number;
  avarez: number;
  total_mani: number;
}

export interface IFaktorProps {
  customer: ICustomer;
}

export interface IProduct {
  id: string | number;
  Title: string;
  colertitle: string;
  Category: string;
  Packing: string;
  Price: string | number;
  Value: string | number;
}

export interface IFaktorDetailProps {
  products?: IProduct[];
}

export interface IFileUploaderProps {
  orderNumber: string;
  subFolder: string;
  docType?: string;
}

export interface ISearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IPersianDatePickerProps {
  value: string | Date | DateObject | null;
  onChange: (date: string) => void;
}

export type ContextType = { faktorNumber: string };

export interface ICarrySlideProps {
  GUID: string;
  faktorNumber: string;
  setPage: (value: number) => void;
}

export interface ICarrySliderProps {
  faktorNumber: string;
}

export interface ISliderControlsProps {
  onNext: () => void;
  onPrev: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
}

export interface ISectionHeaderProps {
  title: string;
  className?: string;
}

export interface ISlideLayoutProps {
  title: string;
  onNext: () => void;
  onPrev: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
  children: ReactNode;
}
