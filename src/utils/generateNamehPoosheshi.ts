import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import type { INamehPoosheshiWordDataProps } from "./type";

export async function generateNamehPoosheshi(
  data: INamehPoosheshiWordDataProps
): Promise<void> {
  const {
    LCNumber,
    LCTotal,
    tarikhgoshayesh,
    titles,
    totals,
    counts,
    tarikhmabnavalue,
    mabnavalue,
  } = data;

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
                text: `احتراما اسناد حمل مربوط به اعتبار اسنادی شماره ${LCNumber} به ارزش ${LCTotal} ریال گشایش شده در تاریخ ${tarikhgoshayesh} به شرح ذیل به حضورتان ارسال میگردد:`,
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
                text: `1. اصل سیاه تجاری به شماره ${titles} به مبلغ ${totals} ریال و متراژ ${counts} متر در ۱ نسخه`,
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            indent: { right: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. اصل لیست بسته بندی در ۱ نسخه",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            indent: { right: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. اصل گواهی بازرسی در ۱ نسخه",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            indent: { right: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "4. تصویر بارنامه در ۱ نسخه کپی",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            indent: { right: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "5. اصل برگه باسکول زرسیم",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
            indent: { right: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "6. صورت مجلس تحویل و تحول",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
            indent: { right: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `خواهشمند است مجموع وجه فاکتورهای مذکور را در سر رسید ${tarikhmabnavalue} روز ${mabnavalue} در تاریخ تعیین شده به حساب این شرکت واریز نمایید.`,
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
                text: "همچنین خواهشمند است نسخه مهر و امضا شده توسط آن بانک محترم را به عنوان رسید دریافت اسناد عودت فرمایید.",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "مهر و امضا بانک با ذکر تاریخ",
                font: "Arial",
                size: 24,
                rightToLeft: true,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `نامه_پوششی_اعتبار_اسنادی_${LCNumber}.docx`);
  } catch (error) {
    console.error("خطا در تولید یا ذخیره فایل Word:", error);
    throw error;
  }
}
