import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";

const Slide2: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-[32px] font-semibold mt-7">slide 2 </h1>

      <SliderControls onNext={() => setPage(3)} onPrev={() => setPage(1)} />
    </div>
  );
};

export default Slide2;
