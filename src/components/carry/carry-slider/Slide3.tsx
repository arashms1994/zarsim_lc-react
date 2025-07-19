import SlideLayout from "@/components/ui/SliderLayout";
import type { ICarrySliderProps } from "@/utils/type";

const Slide3: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <SlideLayout
      title="ارسال اسناد به بانک"
      onNext={() => setPage(4)}
      onPrev={() => setPage(2)}
    >
      <h2 className="text-xl">این محتوای اسلاید 3 است</h2>
    </SlideLayout>
  );
};

export default Slide3;
