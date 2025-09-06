import { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

const WordDocumentGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateWordDocument = async () => {
    setIsLoading(true);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "گزارش نمونه",
                  bold: true,
                  size: 24,
                  font: "Arial",
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "این یک سند نمونه است که با استفاده از کتابخانه docx در React ایجاد شده است.",
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("ستون ۱")],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("ستون ۲")],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("مقدار نمونه ۱")],
                    }),
                    new TableCell({
                      children: [new Paragraph("مقدار نمونه ۲")],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "گزارش_نمونه.docx");
      setIsLoading(false);
    } catch (error) {
      console.error("خطا در تولید فایل Word:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-semibold">ایجاد فایل Word</h2>
      <button
        onClick={generateWordDocument}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg text-white font-medium ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-800"
        }`}
      >
        {isLoading ? "در حال تولید..." : "دانلود فایل Word"}
      </button>
    </div>
  );
};

export default WordDocumentGenerator;
