import type { ICarrySliderProps } from "@/utils/type";
// import { Navigate } from "react-router";
import SliderControls from "@/components/ui/SLiderControls";
import SectionHeader from "@/components/ui/SectionHeader";

const Slide6: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <SectionHeader title="واریز مبلغ" />
      </div>

      <SliderControls
        onNext={() => {}}
        onPrev={() => setPage(5)}
        disableNext={true}
      />
    </div>
  );
};

export default Slide6;
