import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import SectionHeader from "../ui/SectionHeader";
import CarryForm from "./carry-form/CarryForm";
import CarryTable from "./carry-table/CarryTable";
import CarryPhaseTable from "./carry-phase-table/CarryPhaseTable";
import Slider from "./carry-slider/Slider";
import { useLayoutContext } from "@/providers/LayoutContext";
import { useCarryReceipts, useCustomerFactor } from "@/api/getData";
import { addCarryReceipt, addCarryPhaseGuid } from "@/api/addData";
import type { CarryFormSchema } from "@/utils/validation";
import type { ICarryReceipt } from "@/utils/type";
import { MODAL_CLASSES, TOAST_CONFIG } from "@/utils/constants";

const Carry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCarryFormModalOpen, setCarryFormModalOpen] = useState(false);
  const [selectedReceipts, setSelectedReceipts] = useState<ICarryReceipt[]>([]);
  const [carryPhaseGUID, setCarryPhaseGUID] = useState<string | null>(null);

  const { faktorNumber } = useLayoutContext();
  const {
    data: faktor,
    isError: faktorError,
    isLoading: faktorLoading,
  } = useCustomerFactor(faktorNumber);
  const {
    data: carryReceipt = [],
    isLoading: carryReceiptLoading,
    isError: carryReceiptError,
    refetch: refetchCarryReceipts,
  } = useCarryReceipts(faktorNumber);

  const renderLoadingOrError = () => {
    if (faktorLoading || carryReceiptLoading) {
      return (
        <div className="mt-12 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="mt-2 text-base font-medium text-gray-800">
            در حال بارگذاری...
          </span>
        </div>
      );
    }

    if (faktorError || carryReceiptError) {
      return (
        <div className="text-center text-red-600">خطا در بارگذاری اطلاعات</div>
      );
    }

    return null;
  };

  const handleFormSubmit = useCallback(
    async (formData: CarryFormSchema) => {
      setIsSubmitting(true);
      try {
        await addCarryReceipt({
          Count: String(formData.Count),
          Total: String(formData.Total),
          Title: String(formData.Title),
          Date: String(formData.Date),
          Order_Number: faktorNumber,
          Status: "0",
          Bank_Confirm: "0",
          LC_Number: faktor?.LCNumber || "",
        });
        await refetchCarryReceipts();
        toast.success("اطلاعات با موفقیت ثبت شد!", TOAST_CONFIG);
        setCarryFormModalOpen(false);
      } catch (error) {
        console.error("خطا در ثبت اطلاعات یا آپلود فایل:", error);
        toast.error("خطایی در ثبت اطلاعات رخ داد!", TOAST_CONFIG);
      } finally {
        setIsSubmitting(false);
      }
    },
    [faktorNumber, faktor?.LCNumber, refetchCarryReceipts]
  );

  const handleSelectionChange = useCallback((receipts: ICarryReceipt[]) => {
    const validReceipts = receipts.filter(
      (receipt) => !receipt.Carry_Phase_GUID
    );
    setSelectedReceipts(validReceipts);
  }, []);

  const handleBulkCarryPhase = useCallback(async () => {
    if (selectedReceipts.length === 0) {
      toast.warn("هیچ فاکتوری انتخاب نشده است!", TOAST_CONFIG);
      return;
    }

    try {
      const phaseNumber = await addCarryPhaseGuid(
        selectedReceipts,
        carryReceipt
      );
      setCarryPhaseGUID(phaseNumber);
      await refetchCarryReceipts();
      setSelectedReceipts([]);
      toast.success(
        `${selectedReceipts.length} فاکتور برای ${phaseNumber} ثبت شد!`,
        TOAST_CONFIG
      );
    } catch (error) {
      console.error("خطا در ثبت مرحله حمل:", error);
      toast.error("خطایی در ثبت مرحله حمل رخ داد!", TOAST_CONFIG);
    }
  }, [selectedReceipts, carryReceipt, refetchCarryReceipts]);

  const handlePhaseClick = useCallback(
    (receipts: ICarryReceipt[], phaseGUID: string) => {
      setSelectedReceipts(receipts);
      setCarryPhaseGUID(phaseGUID);
      setIsModalOpen(true);
    },
    []
  );

  const renderSliderModal = () =>
    isModalOpen && (
      <div className={MODAL_CLASSES.overlay}>
        <div className={`${MODAL_CLASSES.container} w-[1200px] h-[680px] overflow-y-scroll`}>
          <Button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setCarryPhaseGUID(null);
              setSelectedReceipts([]);
            }}
            className={MODAL_CLASSES.closeButton}
          >
            X
          </Button>
          <Slider
            faktorNumber={faktorNumber}
            selectedReceipts={selectedReceipts}
            carryPhaseGUID={carryPhaseGUID}
          />
        </div>
      </div>
    );

  const renderFormModal = () =>
    isCarryFormModalOpen && (
      <div className={MODAL_CLASSES.overlay}>
        <div className={`${MODAL_CLASSES.container} w-[500px] h-[500px]`}>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => setCarryFormModalOpen(false)}
            className={MODAL_CLASSES.closeButton}
          >
            X
          </Button>
          <CarryForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    );

  if (renderLoadingOrError()) return renderLoadingOrError();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 relative">
      <SectionHeader title="حمل و پرداخت" />
      <div className="w-full flex justify-between">
        <Button
          type="button"
          onClick={() => !isModalOpen && setCarryFormModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
        >
          افزودن فاکتور
        </Button>

        <Button
          type="button"
          onClick={handleBulkCarryPhase}
          className="bg-[#f12b2b] text-white px-4 py-2 rounded-xl transition-all duration-300"
        >
          ثبت مرحله حمل ({selectedReceipts.length})
        </Button>
      </div>

      <CarryTable
        carryReceipt={carryReceipt}
        onSelectionChange={handleSelectionChange}
        selectedReceipts={selectedReceipts}
        setSelectedReceipts={setSelectedReceipts}
      />
      <CarryPhaseTable
        carryReceipt={carryReceipt}
        onPhaseClick={handlePhaseClick}
      />

      {renderSliderModal()}
      {renderFormModal()}
    </div>
  );
};

export default Carry;
