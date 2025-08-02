import FileUploader from "@/components/file-uploader/FileUploader";
import type { ICarrySlideProps } from "@/utils/type";
import { useRef } from "react";

const Slide5: React.FC<ICarrySlideProps> = ({ faktorNumber, GUID }) => {
  const sendRef = useRef<any>(null);

  const label = "رسید تایید اسناد توسط بانک";
  const subFolder = GUID;
  const docType = "taeidasnad";

  const uploadFile = async () => {
    if (sendRef.current) {
      await sendRef.current.uploadFile();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="w-full min-w-[500px] flex justify-between items-center gap-5">
        <label className="text-[22px] font-medium">{`آپلود ${label}:`}</label>
        <FileUploader
          ref={sendRef}
          orderNumber={faktorNumber}
          subFolder={subFolder}
          docType={docType}
        />
      </div>

      <button
        type="button"
        className="border-none rounded-lg min-w-[200px] p-2 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
        onClick={uploadFile}
      >
        {`آپلود ${label}`}
      </button>
    </div>
  );
};

export default Slide5;
