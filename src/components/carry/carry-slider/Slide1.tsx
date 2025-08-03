import { FIRST_SLIDE_DOCS } from "@/utils/constants";
import type { ICarrySlideProps } from "@/utils/type";
import FileUploader from "@/components/file-uploader/FileUploader";
import FileDownloadLink from "@/components/ui/FileDownloadLink";

const Slide1: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  GUID,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const subFolder = GUID;

  const handleUploadComplete = (docType: string, fileUrl: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: fileUrl,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {FIRST_SLIDE_DOCS.map((d) => (
        <div
          key={d.value}
          className="w-full min-w-[500px] flex justify-between items-center gap-5"
        >
          <label className="text-[22px] font-medium">{`آپلود ${d.label}:`}</label>

          {uploadedFiles[d.value] ? (
            <FileDownloadLink url={uploadedFiles[d.value]} />
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

export default Slide1;
