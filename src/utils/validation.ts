import { z } from "zod";

export const openningFormSchema = z.object({
  LCNumber: z.string().min(1, "شماره اعتبار الزامی است"),
  LCTotal: z.string().refine((val) => !isNaN(Number(val.replace(/,/g, ""))), {
    message: "مبلغ باید عددی باشد",
  }),
  tarikhgoshayesh: z.string().min(1, "تاریخ گشایش الزامی است"),
  tarikheblagh: z.string().min(1, "تاریخ ابلاغ الزامی است"),
  mabnavalue: z.string().min(1, "مبدا زمان تسویه الزامی است"),
  tarikhmabnavalue: z.string().min(1, "مدت زمان تسویه الزامی است"),
});

export type OpenningFormSchema = z.infer<typeof openningFormSchema>;

export const CarryFormSchema = z.object({
  Count: z.string().min(1, "وارد کردن متراژ کل بار الزامیست."),
  Total: z.string().min(1, "وارد کردن ارزش کل بار الزامیست."),
  Title: z.string().min(1, "شماره فاکتور(مالی) الزامیست."),
  Date: z.string().min(1, "تاریخ فاکتور الزامی است."),
});

export type CarryFormSchema = z.infer<typeof CarryFormSchema>;
