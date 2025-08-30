import { useEffect, useState } from "react";
import type { ICarrySlideProps } from "@/utils/type";
import { useUploadedFiles } from "@/hooks/useUploadedFiles";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/base";
import UploadSection from "@/components/ui/UploadSection";
import { MODAL_CLASSES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import BankRejectionModal from "@/components/ui/BankRejectionModal";

const Slide5: React.FC<ICarrySlideProps> = ({
  faktorNumber,
  uploadedFiles,
  setUploadedFiles,
  carryPhaseGUID,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const label = "رسید تایید اسناد توسط بانک";
  const subFolder = carryPhaseGUID || "";
  const docType = "taeidasnad";
  const queryClient = useQueryClient();

  const { data: files } = useUploadedFiles(faktorNumber, subFolder, docType);
  const fileFromServer = files?.[0];
  const fileUrl = fileFromServer
    ? `${BASE_URL}${fileFromServer.ServerRelativeUrl}`
    : null;

  useEffect(() => {
    if (fileUrl && uploadedFiles[docType] !== fileUrl) {
      setUploadedFiles((prev) => ({ ...prev, [docType]: fileUrl }));
    }
  }, [fileUrl, uploadedFiles, setUploadedFiles, docType]);

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({
      queryKey: ["uploadedFiles", faktorNumber, subFolder, docType],
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        <UploadSection
          orderNumber={faktorNumber}
          subFolder={subFolder}
          docType={docType}
          label={label}
          onUploadComplete={handleUploadComplete}
        />

        <div className="flex gap-4 justify-between items-center">
          <button type="button">تایید اسناد توسط بانک</button>
          <button type="button" onClick={() => setModalOpen(true)}>
            رد اسناد توسط بانک
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className={MODAL_CLASSES.overlay}>
          <div className={`${MODAL_CLASSES.container} w-[300px] h-[200px]`}>
            <Button
              type="button"
              onClick={() => {
                setModalOpen(false);
              }}
              className={MODAL_CLASSES.closeButton}
            >
              X
            </Button>
            <BankRejectionModal />
          </div>
        </div>
      )}
    </>
  );
};

export default Slide5;
