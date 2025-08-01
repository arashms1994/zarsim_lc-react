import { z } from "zod";

export const openingFormSchema = z.object({
  LCNumber: z.string().min(1, "شماره اعتبار الزامی است"),
  LCTotalPrice: z
    .string()
    .refine((val) => !isNaN(Number(val.replace(/,/g, ""))), {
      message: "مبلغ باید عددی باشد",
    }),
  LCOpenningDate: z.string().min(1, "تاریخ گشایش الزامی است"),
  LCCommunicationDate: z.string().min(1, "تاریخ ابلاغ الزامی است"),
  LCOriginOpenningDate: z.string().min(1, "مبدا زمان تسویه الزامی است"),
  LCSettlementDate: z.string().min(1, "مدت زمان تسویه الزامی است"),
});

export type OpeningFormSchema = z.infer<typeof openingFormSchema>;
