import { BASE_URL } from "@/api/base";
import type { IFileItem } from "@/utils/type";
import { useQuery } from "@tanstack/react-query";

export const fetchUploadedFiles = async (
  orderNumber: string,
  subFolder: string,
  docType: string
): Promise<IFileItem[]> => {
  const libraryName = "LC_AttachFiles";
  const folderPath = `${libraryName}/${orderNumber}/${subFolder}/${docType}`;

  const res = await fetch(
    `${BASE_URL}/_api/web/GetFolderByServerRelativeUrl('${folderPath}')/Files`,
    {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  );

  if (!res.ok) {
    throw new Error("خطا در دریافت فایل‌ها از شیرپوینت");
  }

  const json = await res.json();
  return json.d.results.map((file: any) => ({
    Name: file.Name,
    ServerRelativeUrl: file.ServerRelativeUrl,
  }));
};

export const useUploadedFiles = (
  orderNumber: string,
  subFolder: string,
  docType?: string
) => {
  return useQuery<IFileItem[], Error>({
    queryKey: ["uploadedFiles", orderNumber, subFolder, docType],
    queryFn: () => fetchUploadedFiles(orderNumber, subFolder, docType!),
    enabled: !!orderNumber && !!subFolder && !!docType,
  });
};
