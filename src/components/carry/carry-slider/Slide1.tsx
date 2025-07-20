import { useRef } from "react";
import { FIRST_SLIDE_DOCS } from "@/utils/constants";
import type { ICarrySlideProps } from "@/utils/type";
import FileUploader from "@/components/file-uploader/FileUploader";

const Slide1: React.FC<ICarrySlideProps> = ({ faktorNumber, GUID }) => {
  const fileUploaders = useRef<any[]>([]);
  
  const subFolder = GUID;

  const uploadAllFiles = () => {
    fileUploaders.current.forEach((uploader) => {
      if (uploader && uploader.uploadFile) {
        uploader.uploadFile();
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {FIRST_SLIDE_DOCS.map((d, i) => (
        <div
          className="w-full min-w-[500px] flex justify-between items-center gap-5"
          key={i}
        >
          <label className="text-[22px] font-medium">{`آپلود ${d.label}:`}</label>
          <FileUploader
            ref={(el) => {
              if (el) fileUploaders.current[i] = el;
            }}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={d.value}
          />
        </div>
      ))}

      <button
        type="button"
        className="border-none rounded-lg min-w-[200px] p-2 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
        onClick={uploadAllFiles}
      >
        آپلود فایل‌ها
      </button>
    </div>
  );
};

export default Slide1;
