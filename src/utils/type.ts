export interface LayoutContextType {
  searchQuery: string;
  faktorNumber: string;
}

export interface IZarsimLcProps {
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

export interface Customer {
  item: {
    Title: string;
    Date: string;
    Customer: string;
    type_factor: string;
  };
}

export interface Product {
  id: string | number;
  Title: string;
  colertitle: string;
  Category: string;
  Packing: string;
  Price: string | number;
  Value: string | number;
}

export interface FaktorProps {
  customer?: Customer;
}

export interface FaktorDetailProps {
  products?: Product[];
}
