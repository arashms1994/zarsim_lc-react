import { useEffect, useRef, useState } from "react";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import FileUploader from "@/components/file-uploader/FileUploader";
import FileDownloadLink from "@/components/ui/FileDownloadLink";
import { BASE_URL } from "@/api/base";
import type { IUploadSectionProps } from "@/utils/type";


const UploadSection = ({
  orderNumber,
  subFolder,
  docType,
  label,
  onUploadComplete,
}: IUploadSectionProps) => {
  const sendRef = useRef<any>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { data } = useUploadedFiles(orderNumber, subFolder, docType);
  const existingFile = data?.[0];
  const existingUrl = existingFile
    ? `${BASE_URL}${existingFile.ServerRelativeUrl}`
    : null;

  useEffect(() => {
    if (existingUrl) {
      setFileUrl(existingUrl);
    }
  }, [existingUrl]);

  const handleComplete = (url: string) => {
    setFileUrl(url);
    onUploadComplete(url);
  };

  return (
    <div className="w-full min-w-[500px] flex justify-between items-center gap-5">
      <label className="text-[22px] font-medium">{`آپلود ${label}:`}</label>
      {fileUrl ? (
        <FileDownloadLink url={fileUrl} />
      ) : (
        <FileUploader
          ref={sendRef}
          orderNumber={orderNumber}
          subFolder={subFolder}
          docType={docType}
          onUploadComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default UploadSection;
