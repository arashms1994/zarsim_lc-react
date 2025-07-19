import SlideLayout from "@/components/ui/SliderLayout";
import type { ICarrySliderProps } from "@/utils/type";

const Slide4: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <SlideLayout
      title="رسید بانک"
      onNext={() => setPage(5)}
      onPrev={() => setPage(3)}
    >
      <h2 className="text-xl">این محتوای اسلاید 4 است</h2>
    </SlideLayout>
  );
};

export default Slide4;
