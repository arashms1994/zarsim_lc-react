import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";

const Slide4: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-[32px] font-semibold mt-7">slide4</h1>

      <SliderControls onNext={() => setPage(5)} onPrev={() => setPage(3)} />
    </div>
  );
};

export default Slide4;
