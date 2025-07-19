import { Button } from "@/components/ui/button";
import type { ISliderControlsProps } from "@/utils/type";

const SliderControls: React.FC<ISliderControlsProps> = ({
  onNext,
  onPrev,
  disableNext = false,
  disablePrev = false,
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      <Button
        onClick={onPrev}
        disabled={disablePrev}
        className={`text-white rounded-full text-sm font-medium h-12 mt-10 p-2 transition-all duration-300 ${
          disablePrev
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#009E08] text-[#e7e7e7] hover:bg-[#c5c5c5]"
        }`}
        type="button"
      >
        قبلی
      </Button>

      <Button
        onClick={onNext}
        disabled={disableNext}
        className={`text-white rounded-full text-sm font-medium h-12 mt-10 p-2 transition-all duration-300 ${
          disableNext
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#009E08] text-[#e7e7e7] hover:bg-[#c5c5c5]"
        }`}
        type="button"
      >
        بعدی
      </Button>
    </div>
  );
};

export default SliderControls;
