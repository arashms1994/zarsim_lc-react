import { useRef } from "react";
import FileUploader from "@/components/file-uploader/FileUploader";
import type { ICarrySlideProps } from "@/utils/type";
import FileDownloadLink from "@/components/ui/FileDownloadLink";

const Slide5: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  GUID,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const fileUploaderRef = useRef<any>(null);

  const label = "رسید تایید اسناد توسط بانک";
  const subFolder = GUID;
  const docType = "taeidasnad";

  const handleUploadComplete = (url: string) => {
    setUploadedFiles((prev) => ({ ...prev, [docType]: url }));
  };

  const uploadedFileUrl = uploadedFiles[docType];

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="w-full min-w-[500px] flex justify-between items-center gap-5">
        <label className="text-[22px] font-medium">{`آپلود ${label}:`}</label>

        {uploadedFileUrl ? (
          <FileDownloadLink url={uploadedFileUrl} />
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

export default Slide5;
