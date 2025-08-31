import { updateCarryReceiptBankRejectionStatus } from "@/api/addData";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { TOAST_CONFIG } from "@/utils/constants";
import { toast } from "react-toastify";
import { useState } from "react";
import type { IBankRejectionModalProps } from "@/utils/type";

const BankRejectionModal: React.FC<IBankRejectionModalProps> = ({
  itemIds,
  onClose,
  onRejected,
}) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("لطفاً دلیل رد شدن اسناد را وارد کنید.", TOAST_CONFIG);
      return;
    }

    setLoading(true);
    try {
      await updateCarryReceiptBankRejectionStatus(itemIds, description);
      toast.success("رد اسناد توسط بانک با موفقیت ثبت شد.", TOAST_CONFIG);
      onRejected();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت اطلاعات!", TOAST_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-auto mx-auto flex flex-col w-full h-full justify-center items-center p-2 rtl">
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="دلیل رد شدن اسناد توسط بانک را یادداشت کنید..."
          name="Description"
          id="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900 disabled:bg-gray-400"
        >
          {loading ? "در حال ثبت..." : "ثبت توضیحات"}
        </Button>
      </div>
    </div>
  );
};

export default BankRejectionModal;
