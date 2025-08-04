import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FIRST_SLIDE_DOCS } from "@/utils/constants";
import type { ICarrySlideProps } from "@/utils/type";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";

const Slide1: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  GUID,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const subFolder = GUID;
  const docTypes = FIRST_SLIDE_DOCS.map((d) => d.value);
  const queryClient = useQueryClient();

  const uploadedData = useMultipleUploadedFiles(
    faktorNumber,
    subFolder,
    docTypes
  );

  useEffect(() => {
    docTypes.forEach((docType) => {
      const file = uploadedData[docType]?.data?.[0];
      const fileUrl = file ? `${BASE_URL}${file.ServerRelativeUrl}` : null;

      if (fileUrl && uploadedFiles[docType] !== fileUrl) {
        setUploadedFiles((prev) => ({ ...prev, [docType]: fileUrl }));
      }
    });
  }, [docTypes, setUploadedFiles, uploadedData, uploadedFiles]);

  const handleUploadComplete = (docType: string) => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {FIRST_SLIDE_DOCS.map((doc) => (
        <UploadSection
          key={doc.value}
          orderNumber={faktorNumber}
          subFolder={subFolder}
          docType={doc.value}
          label={doc.label}
          onUploadComplete={() => handleUploadComplete(doc.value)}
        />
      ))}
    </div>
  );
};

export default Slide1;
