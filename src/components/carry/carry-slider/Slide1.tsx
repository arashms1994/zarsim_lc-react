import SectionHeader from "@/components/ui/SectionHeader";
import SliderControls from "@/components/ui/SLiderControls";
import type { ICarrySliderProps } from "@/utils/type";

const Slide1: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <SectionHeader title="حمل" />
      </div>

      <SliderControls
        onNext={() => setPage(2)}
        onPrev={() => {}}
        disablePrev={true}
      />
    </div>
  );
};

export default Slide1;
