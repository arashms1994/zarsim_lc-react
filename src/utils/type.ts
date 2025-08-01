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

export type IOpenningFormData = {
  LCNumber: string;
  LCTotalPrice: number;
  LCOpenningDate: string;
  LCCommunicationDate: string;
  LCOriginOpenningDate: string;
  LCSettlementDate: string;
};

export interface IOpenningFormProps {
  onSubmit: (formData: any) => Promise<void>;
  faktorData?: ICustomer;
  fileRef: React.RefObject<any>;
  faktorNumber: string;
}

export interface ICarryProps {
  faktorNumber: string;
}

export interface ICustomer {
  ID: number;
  Date: string;
  Title: string;
  Customer: string;
  mabnavalue: string;
  tarikhmabnavalue: string;
  BankAccountvalue: string | null;
  type_factor: string;
  name_peyghirikonande: string;
  FirstUser: string;
  LCTotal: string | null;
  LCNumber: string | null;
  LCEnding: string | null;
  total_mani: string;
  tarikhgoshayesh: string | null;
  tarikheblagh: string | null;
  MainTotalCu: number;
  MainTotakTICU: number;
  takhfif: string;
  avarez: string;
  total_SUM: string;
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
