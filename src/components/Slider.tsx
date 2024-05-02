import { ChangeEvent } from "react";

interface SliderProps {
  onchange: Function;
  max: number;
  min: number;
  step: number;
  defaultval: number;
}

export default function SliderComponent({ onchange, max, min, step, defaultval }: SliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onchange(event.target.value);
  };
  return (
    <div className="slidercomponent">
      <h6 className="slidertitle">Animation speed</h6>
      <div className="sliderwrapper">
        <input
          id="slider"
          type="range"
          min={min}
          max={max}
          step={step}
          defaultValue={defaultval}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
