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
        <Button type="button">ثبت توضیحات</Button>
      </div>
    </div>
  );
};

export default BankRejectionModal;
