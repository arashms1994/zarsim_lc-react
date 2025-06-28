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
  item: {
    Title: string;
    Date: string;
    Customer: string;
    type_factor: string;
  };
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

export interface IFaktorProps {
  customer?: ICustomer;
}

export interface IFaktorDetailProps {
  products?: IProduct[];
}


export interface IFileUploaderProps {
  orderNumber: string;
  subFolder: string;
}