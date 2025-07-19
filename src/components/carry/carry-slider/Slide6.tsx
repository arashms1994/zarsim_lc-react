import type { ICarrySliderProps } from "@/utils/type";
import SlideLayout from "@/components/ui/SliderLayout";
// import { Navigate } from "react-router";

const Slide6: React.FC<ICarrySliderProps> = ({ setPage }) => {
  return (
    <SlideLayout
      title="واریز مبلغ"
      onNext={() => {}}
      onPrev={() => setPage(5)}
      disableNext={true}
    >
      <h2 className="text-xl">این محتوای اسلاید 6 است</h2>
    </SlideLayout>
  );
};

export default Slide6;
