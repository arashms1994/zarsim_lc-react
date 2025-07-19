import type { ICarrySliderProps } from "@/utils/type";
import SlideLayout from "@/components/ui/SliderLayout";

const Slide2: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <SlideLayout
      title="آماده سازی اسناد"
      onNext={() => setPage(3)}
      onPrev={() => setPage(1)}
    >
      <h2 className="text-xl">این محتوای اسلاید 2 است</h2>
    </SlideLayout>
  );
};

export default Slide2;
