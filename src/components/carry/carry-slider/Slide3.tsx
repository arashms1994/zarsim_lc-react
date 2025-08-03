import { useRef } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import FileUploader from "@/components/file-uploader/FileUploader";
import FileDownloadLink from "@/components/ui/FileDownloadLink";

const Slide3: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  GUID,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const fileUploaderRef = useRef<any>(null);

  const label = "نامه پوششی";
  const subFolder = GUID;
  const docType = "namehpoosheshi";

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

export default Slide3;
