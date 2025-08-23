import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import type { ICarryTableProps, ICarryReceipt } from "@/utils/type";
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";

interface CarryTableProps extends ICarryTableProps {
  onSelectionChange?: (selectedReceipts: ICarryReceipt[]) => void;
}

const CarryTable: React.FC<CarryTableProps> = ({
  carryReceipt = [],
  onReceiptClick,
  onSelectionChange,
}) => {
  const [selectedReceipts, setSelectedReceipts] = useState<ICarryReceipt[]>([]);

  const columns = [
    { label: "", key: "" },
    { label: "شماره فاکتور", key: "Title" },
    { label: "تاریخ", key: "Date" },
    { label: "متراژ", key: "Count" },
    { label: "مبلغ کل", key: "Total" },
    { label: "شماره پیش‌فاکتور", key: "Order_Number" },
    { label: "شماره LC", key: "LC_Number" },
  ];

  const handleSelectReceipt = (receipt: ICarryReceipt) => {
    setSelectedReceipts((prev) => {
      const isSelected = prev.some((item) => item.GUID === receipt.GUID);
      const updatedSelection = isSelected
        ? prev.filter((item) => item.GUID !== receipt.GUID)
        : [...prev, receipt];

      onSelectionChange?.(updatedSelection);
      return updatedSelection;
    });
  };

  // const handleSelectAll = () => {
  //   if (selectedReceipts.length === carryReceipt.length) {
  //     setSelectedReceipts([]);
  //     onSelectionChange?.([]);
  //   } else {
  //     setSelectedReceipts(carryReceipt);
  //     onSelectionChange?.(carryReceipt);
  //   }
  // };

  const renderRow = (invoice: ICarryReceipt) => (
    <Tooltip key={invoice.GUID}>
      <TooltipTrigger asChild>
        <TableRow
          onClick={() => onReceiptClick(invoice)}
          className="cursor-pointer hover:bg-gray-100 transition-all duration-300"
        >
          <TableCell className="text-center">
            <Checkbox
              className="min-w-0"
              id={`checkbox-${invoice.GUID}`}
              checked={selectedReceipts.some(
                (item) => item.GUID === invoice.GUID
              )}
              onCheckedChange={() => handleSelectReceipt(invoice)}
              onClick={(e) => e.stopPropagation()}
            />
          </TableCell>
          <TableCell className="font-medium text-right">
            {invoice.Title}
          </TableCell>
          <TableCell className="text-right">{invoice.Date}</TableCell>
          <TableCell className="text-right">
            {formatNumberWithComma(invoice.Count)}
          </TableCell>
          <TableCell className="text-right">
            {formatNumberWithComma(invoice.Total)}
          </TableCell>
          <TableCell className="text-right">{invoice.Order_Number}</TableCell>
          <TableCell className="text-right">{invoice.LC_Number}</TableCell>
        </TableRow>
      </TooltipTrigger>
      <TooltipContent>
        <p>برای افزودن به مرحل حمل کلیک کنید.</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <Table className="w-full border-collapse">
        <TableCaption className="text-gray-500 mb-4">همه فاکتورها</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200">
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
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                هیچ فاکتوری وجود ندارد
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default CarryTable;
