import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide4: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <SectionHeader title="رسید بانک" />
      </div>

      <SliderControls onNext={() => setPage(5)} onPrev={() => setPage(3)} />
    </div>
  );
};

export default Slide4;
