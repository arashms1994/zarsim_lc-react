import type { ICarrySliderProps } from "@/utils/type";
import SliderControls from "@/components/ui/SLiderControls";

const Slide3: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-[32px] font-semibold mt-7">slide 3</h1>

      <SliderControls onNext={() => setPage(4)} onPrev={() => setPage(2)} />
    </div>
  );
};

export default Slide3;
