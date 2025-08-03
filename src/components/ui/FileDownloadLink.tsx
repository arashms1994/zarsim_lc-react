import type { IFileDownloadLinkProps } from "@/utils/type";

const FileDownloadLink: React.FC<IFileDownloadLinkProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-start gap-2 p-2 border border-green-500 rounded">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 font-semibold underline"
      >
        دانلود فایل
      </a>
    </div>
  );
};

export default FileDownloadLink;
