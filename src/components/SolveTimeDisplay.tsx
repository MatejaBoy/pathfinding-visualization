import { useEffect, useState } from "react";

interface Props {
  solvetimeProps: number;
}

function SolveTimeDisplay(props: Props) {
  const [solvetime, setSolveTime] = useState(props.solvetimeProps);

  useEffect(() => {
    setSolveTime(props.solvetimeProps);
  }, [props.solvetimeProps]);

  return (
    <>
      <div className="slidercomponent">
        <h6 style={{ fontWeight: "600" }}>Time to solve:</h6>
        <div>{solvetime} ms</div>
      </div>
    </>
  );
}

export default SolveTimeDisplay;
