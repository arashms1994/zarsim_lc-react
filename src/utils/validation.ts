import { z } from "zod";

export const openingFormSchema = z.object({
  LCNumber: z.string().min(1, "شماره اعتبار الزامی است"),
  LCTotal: z
    .string()
    .refine((val) => !isNaN(Number(val.replace(/,/g, ""))), {
      message: "مبلغ باید عددی باشد",
    }),
  tarikhgoshayesh: z.string().min(1, "تاریخ گشایش الزامی است"),
  tarikheblagh: z.string().min(1, "تاریخ ابلاغ الزامی است"),
  mabnavalue: z.string().min(1, "مبدا زمان تسویه الزامی است"),
  tarikhmabnavalue: z.string().min(1, "مدت زمان تسویه الزامی است"),
});

export type OpeningFormSchema = z.infer<typeof openingFormSchema>;
