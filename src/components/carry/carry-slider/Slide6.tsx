import type { ICarrySliderProps } from "@/utils/type";
// import { Navigate } from "react-router";
import SliderControls from "@/components/ui/SLiderControls";

const Slide6: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-[32px] font-semibold mt-7">slide6</h1>

      <SliderControls
        onNext={() => {}}
        onPrev={() => setPage(5)}
        disableNext={true}
      />
    </div>
  );
};

export default Slide6;
