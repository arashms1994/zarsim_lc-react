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

const CarryTable: React.FC<ICarryTableProps> = ({ carryReceipt = [] }) => {
  return (
    <Table>
      <TableCaption>همه مراحل حمل</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>شماره فاکتور</TableHead>
          <TableHead>تاریخ</TableHead>
          <TableHead>متراژ</TableHead>
          <TableHead>مبلغ کل</TableHead>
          <TableHead>شماره پیش فاکتور</TableHead>
          <TableHead>شماره LC</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carryReceipt.map((invoice) => (
          <TableRow key={invoice.Title}>
            <TableCell className="font-medium">{invoice.Title}</TableCell>
            <TableCell className="font-medium">{invoice.Date}</TableCell>
            <TableCell>{invoice.Count}</TableCell>
            <TableCell>{invoice.Total}</TableCell>
            <TableCell className="text-right">{invoice.Order_Number}</TableCell>
            <TableCell className="text-right">{invoice.LC_Number}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
};

export default CarryTable;
