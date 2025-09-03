import type { ReactNode } from "react";
import type { DateObject } from "react-multi-date-picker";
import type { CarryFormSchema, OpenningFormSchema } from "./validation";

export interface LayoutContextType {
  searchQuery?: string;
  faktorNumber: string;
}

export interface ICustomerFactorUpdate {
  Title: string;
  LCNumber?: string;
  LCValidation?: string;
  LCTotal?: string;
  tarikhmabnavalue?: string;
  mabnavalue?: string;
  tarikhgoshayesh?: string;
  tarikheblagh?: string;
  tolerance_manfi?: string;
  tolerance_mosbat?: string;
}

export interface ICarryReceipt {
  Id?: number;
  Title?: string;
  Order_Number?: string;
  Count?: string;
  Total?: string;
  LC_Number?: string;
  GUID?: string;
  Bank_Confirm?: string;
  Date?: string;
  Status?: string;
  Carry_Phase_GUID?: string | null;
  Description: string;
  Reject_Version?: string | null;
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

export interface IFileDownloadLinkProps {
  url: string;
}

export interface IFileItem {
  Name: string;
  ServerRelativeUrl: string;
}

export interface IFileUploadRef {
  uploadFile: () => Promise<void>;
}

export interface ISharePointFileResponse {
  d: {
    results: {
      Name: string;
      ServerRelativeUrl: string;
    }[];
  };
}

export interface IUseMultipleUploadedFilesResult {
  [docType: string]: {
    data: IFileItem[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  };
}

export interface IUploadSectionProps {
  orderNumber: string;
  subFolder: string;
  docType: string;
  label: string;
  onUploadComplete: (url: string) => void;
}

export interface IOpenningFormProps {
  onSubmit: (formData: OpenningFormSchema) => Promise<void>;
  faktorData?: ICustomer;
  fileRef: React.RefObject<IFileUploadRef>;
  faktorNumber: string;
  isSubmitting: boolean;
}

export interface ICarryForm {
  isSubmitting: boolean;
  onSubmit: (formData: CarryFormSchema) => Promise<void>;
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
  LCValidation: string | null;
  total_mani: string;
  tarikhgoshayesh: string | null;
  tarikheblagh: string | null;
  tarikhresidebank: string | null;
  MainTotalCu: number;
  MainTotakTICU: number;
  takhfif: string;
  avarez: string;
  total_SUM: string;
  tolerance_mosbat: string;
  tolerance_manfi: string;
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
  onUploadComplete?: (fileUrl: string) => void;
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
  userName: string;
  carryPhaseGUID: string | null;
  faktorNumber: string;
  setPage: (value: number) => void;
  uploadedFiles: Record<string, string>;
  selectedReceipts: ICarryReceipt[] | null;
  setUploadedFiles: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

export interface ICarrySliderProps {
  faktorNumber: string;
  selectedReceipts: ICarryReceipt[] | null;
  carryPhaseGUID: string | null;
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

export interface ICarryPhaseTableProps {
  carryReceipt?: ICarryReceipt[];
  onPhaseClick?: (receipts: ICarryReceipt[], carryPhaseGUID: string) => void;
}

export interface ICarryTableProps extends ICarryPhaseTableProps {
  carryReceipt?: ICarryReceipt[];
  onSelectionChange?: (receipts: ICarryReceipt[]) => void;
  selectedReceipts: ICarryReceipt[];
  setSelectedReceipts: React.Dispatch<React.SetStateAction<ICarryReceipt[]>>;
}

export interface INotificationItem {
  Title: string;
  dont_show?: string;
  deadline?: string;
  assign?: string;
  from_list?: string;
  item_id?: string;
  massage?: string;
  From_Date?: string;
  Item_URL?: string;
  Snooze?: string;
}

export interface IBankRejectionModalProps {
  itemIds: number[];
  onClose: () => void;
  onRejected: () => void;
}

export interface ISPPageContextInfo {
  userLoginName: string;
  userId: number;
  webAbsoluteUrl: string;
  webTitle: string;
  siteAbsoluteUrl: string;
  siteId: string;
  webId: string;
}
