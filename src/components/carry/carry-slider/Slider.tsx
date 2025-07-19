import { useState } from "react";
import Slide1 from "./Slide1";
import Slide2 from "./Slide2";
import Slide3 from "./Slide3";
import Slide6 from "./Slide6";
import Slide5 from "./Slide5";
import Slide4 from "./Slide4";

const Slider = () => {
  const [page, setPage] = useState(0);

  return (
    <>
      {page === 1 && <Slide1 setPage={setPage} />}
      {page === 2 && <Slide2 setPage={setPage} />}
      {page === 3 && <Slide3 setPage={setPage} />}
      {page === 4 && <Slide4 setPage={setPage} />}
      {page === 5 && <Slide5 setPage={setPage} />}
      {page === 6 && <Slide6 setPage={setPage} />}
    </>
  );
};

export default Slider;
