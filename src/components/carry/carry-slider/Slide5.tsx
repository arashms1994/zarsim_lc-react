import type { ICarrySliderProps } from "@/utils/type";
import SlideLayout from "@/components/ui/SliderLayout";

const Slide5: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <SlideLayout
      title="تایید اسناد"
      onNext={() => setPage(6)}
      onPrev={() => setPage(4)}
    >
      <h2 className="text-xl">این محتوای اسلاید 5 است</h2>
    </SlideLayout>
  );
};

export default Slide5;
