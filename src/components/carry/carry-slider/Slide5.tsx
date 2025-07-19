import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide5: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <SectionHeader title="تایید اسناد" />
      </div>

      <SliderControls onNext={() => setPage(6)} onPrev={() => setPage(4)} />
    </div>
  );
};

export default Slide5;
