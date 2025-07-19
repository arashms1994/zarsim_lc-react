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
        className={`text-white rounded-full text-sm font-medium h-12 mt-10 p-2 ${
          disablePrev
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#212529] hover:bg-gray-800"
        }`}
        type="button"
      >
        قبلی
      </Button>

      <Button
        onClick={onNext}
        disabled={disableNext}
        className={`text-white rounded-full text-sm font-medium h-12 mt-10 p-2 ${
          disableNext
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#212529] hover:bg-gray-800"
        }`}
        type="button"
      >
        بعدی
      </Button>
    </div>
  );
};

export default SliderControls;
