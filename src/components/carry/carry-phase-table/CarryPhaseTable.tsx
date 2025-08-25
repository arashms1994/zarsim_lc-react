import type { ICarryPhaseTableProps, ICarryReceipt } from "@/utils/type";
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
import { formatNumberWithComma } from "@/utils/formatNumberWithComma";

const CarryPhaseTable: React.FC<ICarryPhaseTableProps> = ({
  carryReceipt = [],
  onPhaseClick,
}) => {
  const groupedReceipts = carryReceipt.reduce((acc, invoice) => {
    if (invoice.Carry_Phase_GUID) {
      if (!acc[invoice.Carry_Phase_GUID]) {
        acc[invoice.Carry_Phase_GUID] = [];
      }
      acc[invoice.Carry_Phase_GUID].push(invoice);
    }
    return acc;
  }, {} as Record<string, ICarryReceipt[]>);

  const carryPhases = Object.entries(groupedReceipts).map(
    ([carryPhaseGUID, receipts]) => {
      const titles = receipts.map((r) => r.Title).join(", ");
      const totalCount = receipts.reduce(
        (sum, r) => sum + Number(r.Count || 0),
        0
      );
      const totalValue = receipts.reduce(
        (sum, r) => sum + Number(r.Total || 0),
        0
      );
      const date = receipts[0].Date;
      const orderNumber = receipts[0].Order_Number;
      const lcNumber = receipts[0].LC_Number;

      return {
        carryPhaseGUID,
        titles,
        totalCount,
        totalValue,
        date,
        orderNumber,
        lcNumber,
        receipts,
      };
    }
  );

  return (
    <TooltipProvider>
      <Table className="w-full border-collapse">
        <TableCaption className="text-gray-500 mb-4">
          همه مراحل حمل
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead className="text-right">مرحله حمل</TableHead>
            <TableHead className="text-right">شماره فاکتورها</TableHead>
            <TableHead className="text-right">تاریخ</TableHead>
            <TableHead className="text-right">متراژ مجموع</TableHead>
            <TableHead className="text-right">ارزش کل بار</TableHead>
            <TableHead className="text-right">شماره پیش‌فاکتور</TableHead>
            <TableHead className="text-right">شماره LC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carryPhases.length > 0 ? (
            carryPhases.map((phase) => (
              <Tooltip key={phase.carryPhaseGUID}>
                <TooltipTrigger asChild>
                  <TableRow
                    onClick={() =>
                      onPhaseClick?.(phase.receipts, phase.carryPhaseGUID)
                    }
                    className="cursor-pointer hover:bg-gray-100 transition-all duration-300"
                  >
                    <TableCell className="font-medium text-right">
                      {phase.carryPhaseGUID}
                    </TableCell>
                    <TableCell className="text-right">{phase.titles}</TableCell>
                    <TableCell className="text-right">{phase.date}</TableCell>
                    <TableCell className="text-right">
                      {formatNumberWithComma(phase.totalCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumberWithComma(phase.totalValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {phase.orderNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      {phase.lcNumber}
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>برای ثبت جزئیات مرحله حمل کلیک کنید.</p>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
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
