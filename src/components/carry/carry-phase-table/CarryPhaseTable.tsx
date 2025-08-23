import type { ICarryTableProps } from "@/utils/type";
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

const CarryPhaseTable: React.FC<ICarryTableProps> = ({
  carryReceipt = [],
  onReceiptClick,
}) => {
  return (
    <TooltipProvider>
      <Table className="w-full border-collapse">
        <TableCaption className="text-gray-500 mb-4">
          همه مراحل حمل
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead>شماره فاکتورها</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>متراژمجموع</TableHead>
            <TableHead>ارزش کل بار</TableHead>
            <TableHead>شماره پیش‌فاکتور</TableHead>
            <TableHead>شماره LC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carryReceipt.length > 0 ? (
            carryReceipt.map((invoice) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableRow
                    key={invoice.Title}
                    onClick={() => onReceiptClick(invoice)}
                    className="cursor-pointer hover:bg-gray-100 transition-all duration-300"
                  >
                    <TableCell className="font-medium text-right">
                      {invoice.Title}
                    </TableCell>
                    <TableCell className="text-right">{invoice.Date}</TableCell>
                    <TableCell className="text-right">
                      {invoice.Count}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.Total}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.Order_Number}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.LC_Number}
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>برای تکمیل مرحله کلیک کنید.</p>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                هیچ مرحله‌ای ثبت نشده است
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default CarryPhaseTable;