import FileUploader from "@/components/file-uploader/FileUploader";
import Guid from "@/utils/createGUID";
import type { ICarrySlideProps } from "@/utils/type";
import { useRef } from "react";

const Slide1: React.FC<ICarrySlideProps> = ({
  faktorNumber,
}: {
  faktorNumber: string;
}) => {
  const fileUploaders = useRef<any[]>([]);
  const subFolder = Guid();

  const uploadAllFiles = () => {
    fileUploaders.current.forEach((uploader) => {
      if (uploader && uploader.uploadFile) {
        uploader.uploadFile();
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {["فاکتور فروش", "بارنامه", "برگه باسکول"].map((label, idx) => (
        <div
          className="w-full min-w-[500px] flex justify-between items-center gap-5"
          key={label}
        >
          <label className="text-[22px] font-medium">{`آپلود ${label}:`}</label>
          <FileUploader
            ref={(el) => {
              if (el) fileUploaders.current[idx] = el;
            }}
            orderNumber={faktorNumber}
            subFolder={subFolder}
            docType={label}
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
