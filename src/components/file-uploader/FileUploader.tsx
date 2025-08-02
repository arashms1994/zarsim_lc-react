import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { BASE_URL } from "../../api/base";
import { getDigest } from "../../utils/getDigest";
import type { IFileUploaderProps } from "@/utils/type";

const FileUploader = forwardRef<unknown, IFileUploaderProps>(
  ({ orderNumber, subFolder, docType, onUploadComplete }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getFile: () => selectedFile,
      uploadFile,
      clearFile,
    }));

    function clearFile() {
      setSelectedFile(null);
      setUploadStatus("");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    async function uploadFile() {
      if (!selectedFile) {
        setUploadStatus("لطفا یک فایل انتخاب کنید");
        return;
      }

      if (!orderNumber) {
        setUploadStatus("شماره سفارش معتبر نیست");
        return;
      }

      const cleanOrderNumber = orderNumber.replace(/[#%*<>?/\\|]/g, "_");
      const cleanSubFolder = subFolder.replace(/[#%*<>?/\\|]/g, "_");
      const cleanDocType = docType?.replace(/[#%*<>?/\\|]/g, "_");
      const cleanFileName = selectedFile.name.replace(/[#%*<>?/\\|]/g, "_");

      const libraryName = "LC_AttachFiles";
      const folderParts = [libraryName, cleanOrderNumber, cleanSubFolder];

      if (cleanDocType) folderParts.push(cleanDocType);

      const fullFolderPath = folderParts.join("/");

      try {
        const digest = await getDigest();

        const createFolder = (path: string) =>
          fetch(`${BASE_URL}/_api/web/folders/add('${path}')`, {
            method: "POST",
            headers: {
              Accept: "application/json;odata=verbose",
              "X-RequestDigest": digest,
            },
          }).catch(() => {}); // نادیده گرفتن خطا اگه پوشه قبلاً وجود داشته باشه

        // ایجاد پوشه‌ها به ترتیب
        let currentPath = "";
        for (const part of folderParts) {
          currentPath += currentPath ? `/${part}` : part;
          await createFolder(currentPath);
        }

        const arrayBuffer = await selectedFile.arrayBuffer();

        const uploadRes = await fetch(
          `${BASE_URL}/_api/web/GetFolderByServerRelativeUrl('${fullFolderPath}')/Files/add(overwrite=true, url='${cleanFileName}')`,
          {
            method: "POST",
            body: arrayBuffer,
            headers: {
              Accept: "application/json;odata=verbose",
              "X-RequestDigest": digest,
              "Content-Type": "application/octet-stream",
            },
          }
        );

        if (uploadRes.ok) {
          setUploadStatus("فایل با موفقیت آپلود شد");
          setUploadProgress(100);
          const uploadedUrl = `${BASE_URL}/${fullFolderPath}/${cleanFileName}`;
          onUploadComplete?.(uploadedUrl);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          throw new Error("خطا در آپلود فایل");
        }
      } catch (error) {
        console.error("خطا در آپلود:", error);
        setUploadStatus("خطا در آپلود فایل");
        setUploadProgress(0);
      }
    }

    const inputId = React.useMemo(
      () => "file_" + Math.random().toString(36).substring(2, 9),
      []
    );

    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-around items-center min-w-[230px] h-[50px] gap-4 flex-wrap">
          <label
            htmlFor={inputId}
            className="px-2 py-1 w-[95px] h-[30px] rounded-lg text-white bg-green-600 font-semibold flex justify-center items-center cursor-pointer hover:bg-green-800 transition-all duration-300"
          >
            انتخاب فایل
          </label>
          <input
            className="hidden"
            id={inputId}
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setUploadStatus("");
                setUploadProgress(0);
              }
            }}
          />

          {selectedFile ? (
            <div className="flex items-center justify-center">
              <p className="text-[13px] font-bold text-gray-800 flex items-center">
                {selectedFile.name}
              </p>
              <button
                type="button"
                onClick={clearFile}
                aria-label="پاک کردن فایل"
                className="ml-2 text-red-600 text-xl font-bold hover:text-red-400 transition-all duration-300 bg-transparent border-none"
              >
                ×
              </button>
            </div>
          ) : (
            <p className="text-[13px] font-bold text-gray-800 flex items-center">
              هنوز فایلی انتخاب نشده
            </p>
          )}
        </div>

        {selectedFile && (
          <button
            type="button"
            onClick={uploadFile}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-800 transition duration-300 self-start"
          >
            آپلود فایل
          </button>
        )}

        {uploadStatus && (
          <div
            className={`font-bold text-sm mt-1 ${
              uploadProgress === 100 ? "text-green-700" : "text-red-600"
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </div>
    );
  }
);

export default FileUploader;
