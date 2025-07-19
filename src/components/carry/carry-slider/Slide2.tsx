import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide2: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <SectionHeader title="آماده سازی اسناد" />
      </div>

      <SliderControls onNext={() => setPage(3)} onPrev={() => setPage(1)} />
    </div>
  );
};

export default Slide2;
