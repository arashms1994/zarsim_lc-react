import { useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { SECOND_SLIDE_DOCS } from "@/utils/constants";
import FileUploader from "@/components/file-uploader/FileUploader";

const Slide2: React.FC<ICarrySlideProps> = ({ faktorNumber, GUID }) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>(
    {}
  );

  const subFolder = GUID;

  const handleUploadComplete = (docType: string, fileUrl: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: fileUrl,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {SECOND_SLIDE_DOCS.map((d) => (
        <div
          key={d.value}
          className="w-full min-w-[500px] flex justify-between items-center gap-5"
        >
          <label className="text-[22px] font-medium">{`آپلود ${d.label}:`}</label>

          {uploadedFiles[d.value] ? (
            <div className="flex flex-col items-start gap-2 p-2 border border-green-500 rounded">
              <a
                href={uploadedFiles[d.value]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-semibold underline"
              >
                دانلود فایل
              </a>
            </div>
          ) : (
            <FileUploader
              orderNumber={faktorNumber}
              subFolder={subFolder}
              docType={d.value}
              onUploadComplete={(url) => handleUploadComplete(d.value, url)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Slide2;
