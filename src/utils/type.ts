export interface LayoutContextType {
  searchQuery: string;
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
}