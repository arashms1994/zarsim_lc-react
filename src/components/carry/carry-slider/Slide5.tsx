import { useEffect } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";

const Slide5: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  GUID,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const label = "رسید تایید اسناد توسط بانک";
  const subFolder = GUID;
  const docType = "taeidasnad";
  const queryClient = useQueryClient();

  const { data: files } = useUploadedFiles(faktorNumber, subFolder, docType);
  const fileFromServer = files?.[0];
  const fileUrl = fileFromServer
    ? `${BASE_URL}${fileFromServer.ServerRelativeUrl}`
    : null;

  useEffect(() => {
    if (fileUrl && uploadedFiles[docType] !== fileUrl) {
      setUploadedFiles((prev) => ({ ...prev, [docType]: fileUrl }));
    }
  }, [fileUrl, uploadedFiles, setUploadedFiles, docType]);

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <UploadSection
        orderNumber={faktorNumber}
        subFolder={subFolder}
        docType={docType}
        label={label}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default Slide5;
