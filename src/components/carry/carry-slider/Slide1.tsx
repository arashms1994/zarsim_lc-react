import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FIRST_SLIDE_DOCS } from "@/utils/constants";
import type { ICarrySlideProps } from "@/utils/type";
import { useMultipleUploadedFiles } from "@/hooks/useMultipleUploadedFiles ";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { updateCarryReceiptStatus } from "@/api/addData";
import { toast, Bounce } from "react-toastify";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide1: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
  selectedReceipts,
}) => {
  const [localReceipts, setLocalReceipts] = useState(selectedReceipts || []);
  const allStatusTwo = localReceipts.every((r) => Number(r.Status) >= 2);
  
  const subFolder = carryPhaseGUID || "";
  const docTypes = FIRST_SLIDE_DOCS.map((d) => d.value);
  const queryClient = useQueryClient();

  const uploadedData = useMultipleUploadedFiles(
    faktorNumber,
    subFolder,
    docTypes
  );

  const itemIds =
    selectedReceipts
      ?.map((r) => r.Id)
      .filter((id): id is number => typeof id === "number") || [];

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

  const handleSubmit = async () => {
    const allUploaded = docTypes.every((docType) => uploadedFiles[docType]);
    if (!allUploaded) {
      toast.error("لطفاً همه فایل‌ها را آپلود کنید.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if (itemIds.length === 0) {
      toast.error("آیتم‌های رسید حمل مشخص نشده‌اند!", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      await updateCarryReceiptStatus(itemIds, "2");

      setLocalReceipts((prev) =>
        prev.map((r) => ({
          ...r,
          Status: Number(r.Status) >= 2 ? r.Status : "2",
        }))
      );

      toast.success("وضعیت رسید حمل با موفقیت بروزرسانی شد!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error(error);
      toast.error("خطا در آپدیت وضعیت رسید حمل!", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
    }
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

      <div>
        {allStatusTwo ? (
          <SectionHeader
            title={"این مرحله تکمیل شده است، لطفا به مرحله بعد مراجعه کنید."}
          />
        ) : (
          <button
            type="button"
            disabled={
              !docTypes.every((docType) => uploadedFiles[docType]) ||
              allStatusTwo
            }
            className={`border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold transition-all duration-300 cursor-pointer
     ${
       !allStatusTwo && docTypes.every((docType) => uploadedFiles[docType])
         ? "bg-blue-600 text-white hover:bg-blue-900"
         : "bg-gray-400 text-gray-200 cursor-not-allowed"
     }`}
            onClick={() => {
              handleSubmit();
            }}
          >
            پایان آپلود فایل‌های مرتبط با حمل
          </button>
        )}
      </div>
    </div>
  );
};

export default Slide1;
