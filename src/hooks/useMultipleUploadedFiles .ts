import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import type { IUseMultipleUploadedFilesResult } from "@/utils/type";
import { fetchUploadedFiles } from "./useUploadedFiles";

type DocType = string;

export const useMultipleUploadedFiles = (
  orderNumber: string,
  subFolder: string,
  docTypes: DocType[]
): IUseMultipleUploadedFilesResult => {
  const queries = useQueries({
    queries: docTypes.map((docType) => ({
      queryKey: ["uploadedFiles", orderNumber, subFolder, docType],
      queryFn: () => fetchUploadedFiles(orderNumber, subFolder, docType),
      enabled: !!orderNumber && !!subFolder && !!docType,
    })),
  });

  return useMemo(() => {
    const result: IUseMultipleUploadedFilesResult = {};
    docTypes.forEach((docType, i) => {
      const query = queries[i];
      result[docType] = {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
      };
    });
    return result;
  }, [queries, docTypes]);
};
