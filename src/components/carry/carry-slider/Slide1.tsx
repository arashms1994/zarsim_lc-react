import SliderControls from "@/components/ui/SLiderControls";
import type { ICarrySliderProps } from "@/utils/type";

const Slide1: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-[32px] font-semibold mt-7">slide 1 </h1>

      <SliderControls
        onNext={() => setPage(2)}
        onPrev={() => {}}
        disablePrev={true}
      />
    </div>
  );
};

export default Slide1;
