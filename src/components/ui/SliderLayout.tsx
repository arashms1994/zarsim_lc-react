import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import SliderControls from "./SLiderControls";
import type { ISlideLayoutProps } from "@/utils/type";

const SlideLayout: React.FC<ISlideLayoutProps> = ({
  title,
  onNext,
  onPrev,
  disableNext = false,
  disablePrev = false,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <SectionHeader title={title} />

      <div className="my-6 w-full max-w-md">{children}</div>

      <SliderControls
        onNext={onNext}
        onPrev={onPrev}
        disableNext={disableNext}
        disablePrev={disablePrev}
      />
    </div>
  );
};

export default SlideLayout;
