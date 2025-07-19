import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide3: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <SectionHeader title="ارسال اسناد به بانک" />
      </div>

      <SliderControls onNext={() => setPage(4)} onPrev={() => setPage(2)} />
    </div>
  );
};

export default Slide3;
