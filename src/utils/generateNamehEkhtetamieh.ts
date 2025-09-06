import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import type { INamehEkhtetamiehWordDataProps } from "./type";

export async function generateNamehEkhtetamieh(
  data: INamehEkhtetamiehWordDataProps
): Promise<void> {
  console.log("شروع generateEkhtetamLetter", { data });

  const { BankAccountvalue, LCNumber, Customer } = data;

  console.log("ایجاد سند Word");
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `بانک ${BankAccountvalue}`,
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `موضوع: اختتام اعتبار اسنادی شماره ${LCNumber}`,
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "با سلام؛",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `احتراما به استحضار می رساند نظر به حمل و تسویه اعتبار اسنادی به شماره ${LCNumber} گشایش شده توسط (نام بانک گشایش کننده را وارد کنید.) مشتری ${Customer}، خاتمه این اعتبار اسنادی بلامانع می باشد.`,
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  try {
    console.log("تولید فایل Word");
    const blob = await Packer.toBlob(doc);
    console.log("فایل Blob با موفقیت تولید شد");
    saveAs(blob, `نامه_اختتامیه_اعتبار_${LCNumber}.docx`);
    console.log("فایل Word ذخیره شد");
  } catch (error) {
    console.error("خطا در تولید یا ذخیره فایل Word:", error);
    throw error;
  }
}
