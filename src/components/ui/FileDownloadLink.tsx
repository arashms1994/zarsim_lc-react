import type { IFileDownloadLinkProps } from "@/utils/type";

const FileDownloadLink: React.FC<IFileDownloadLinkProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-start gap-2 p-2 border-2 border-[#0d8957] rounded">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0d8957] font-semibold underline text-base"
      >
        دانلود فایل
      </a>
    </div>
  );
};

export default FileDownloadLink;
