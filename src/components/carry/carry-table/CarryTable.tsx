import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";
import type { ICarryReceipt, ICarryTableProps } from "@/utils/type";

export const CarryTable: React.FC<ICarryTableProps> = ({
  carryReceipt = [],
  onSelectionChange,
  selectedReceipts,
  setSelectedReceipts,
}) => {
  const columns = [
    { label: "شماره فاکتور", key: "Title" },
    { label: "تاریخ", key: "Date" },
    { label: "متراژ", key: "Count" },
    { label: "مبلغ کل", key: "Total" },
    { label: "شماره پیش‌فاکتور", key: "Order_Number" },
    { label: "شماره LC", key: "LC_Number" },
  ];

  const handleSelectReceipt = (receipt: ICarryReceipt) => {
    if (receipt.Carry_Phase_GUID) return;
    const isSelected = selectedReceipts.some(
      (item) => item.GUID === receipt.GUID
    );
    const updatedSelection = isSelected
      ? selectedReceipts.filter((item) => item.GUID !== receipt.GUID)
      : [...selectedReceipts, receipt];

    setSelectedReceipts(updatedSelection);
    onSelectionChange?.(updatedSelection);
  };

  const renderRow = (invoice: ICarryReceipt) => {
    const isSelected = selectedReceipts.some(
      (item: ICarryReceipt) => item.GUID === invoice.GUID
    );

    return (
      <TableRow
        className={`cursor-pointer transition-all duration-300 ${
          invoice.Carry_Phase_GUID
            ? "bg-gray-100 text-gray-500"
            : isSelected
            ? "bg-blue-100 font-medium"
            : "hover:bg-gray-50"
        }`}
        onClick={() => handleSelectReceipt(invoice)}
      >
        <TableCell className="text-right">
          {invoice.Carry_Phase_GUID
            ? "این فاکتور قبلا انتخاب شده است."
            : isSelected
            ? "انتخاب شده"
            : ""}
        </TableCell>
        <TableCell className="font-medium text-right">
          {invoice.Title}
        </TableCell>
        <TableCell className="text-right">{invoice.Date}</TableCell>
        <TableCell className="text-right">
          {formatNumberWithComma(invoice.Count ?? "0")}
        </TableCell>
        <TableCell className="text-right">
          {formatNumberWithComma(invoice.Total ?? "0")}
        </TableCell>
        <TableCell className="text-right">{invoice.Order_Number}</TableCell>
        <TableCell className="text-right">{invoice.LC_Number}</TableCell>
      </TableRow>
    );
  };

  return (
    <TooltipProvider>
      <Table className="w-full border-collapse">
        <TableCaption className="text-gray-500 mb-4">همه فاکتورها</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead className="text-right"></TableHead>{" "}
            {columns.map((column) => (
              <TableHead key={column.key} className="text-right">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {carryReceipt.length > 0 ? (
            carryReceipt.map(renderRow)
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-4 text-gray-500"
              >
                هیچ فاکتوری وجود ندارد
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};
