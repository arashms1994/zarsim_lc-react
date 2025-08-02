import { useState, useRef } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import FileUploader from "@/components/file-uploader/FileUploader";

const Slide3: React.FC<ICarrySlideProps> = ({ faktorNumber, GUID }) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const fileUploaderRef = useRef<any>(null);

  const label = "نامه پوششی";
  const subFolder = GUID;
  const docType = "namehpoosheshi";

  const handleUploadComplete = (url: string) => {
    setUploadedFileUrl(url);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="w-full min-w-[500px] flex justify-between items-center gap-5">
        <label className="text-[22px] font-medium">{`آپلود ${label}:`}</label>

        {uploadedFileUrl ? (
          <div className="flex flex-col items-start gap-2 p-2 border border-green-500 rounded">
            <a
              href={uploadedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold underline"
            >
              دانلود فایل
            </a>
          </div>
        ) : (
          <FileUploader
            ref={fileUploaderRef}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={docType}
            onUploadComplete={handleUploadComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Slide3;
