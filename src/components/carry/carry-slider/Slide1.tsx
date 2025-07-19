import SlideLayout from "@/components/ui/SliderLayout";
import type { ICarrySliderProps } from "@/utils/type";

const Slide1: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <SlideLayout
      title="حمل"
      onNext={() => setPage(2)}
      onPrev={() => {}}
      disablePrev={true}
    >
      <h2 className="text-xl">این محتوای اسلاید 1 است</h2>
    </SlideLayout>
  );
};

export default Slide1;
