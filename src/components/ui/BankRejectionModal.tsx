import { Button } from "./button";
import { Textarea } from "./textarea";

const BankRejectionModal = () => {
  return (
    <div className="my-auto mx-auto flex flex-col w-full h-full justify-center items-center p-2 rtl">
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="دلیل رد شدن اسناد توسط بانک را یادداشت کنید..."
          name="Description"
          id="Description"
        />
        <Button
          type="button"
          className="border-none rounded-lg min-w-[200px] mt-5 p-3 text-[18px] font-semibold bg-blue-600 text-white transition-all duration-300 cursor-pointer hover:bg-blue-900"
        >
          ثبت توضیحات
        </Button>
      </div>
    </div>
  );
};

export default BankRejectionModal;
