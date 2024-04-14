import { ChangeEvent, ChangeEventHandler, useState } from "react";

interface SliderProps {
  onchange: Function;
  max: number;
  min: number;
  step: number;
  defaultval: number;
}

export default function SliderComponent({ onchange, max, min, step, defaultval }: SliderProps) {
  const [value, setValue] = useState(defaultval);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("current val: " + event.target.value);
    onchange(event.target.value);
    setValue(Number(event.target.value));
  };
  return (
    <div className="slidercomponent">
      <div className="slidertitle">Speed: {value}</div>
      <input
        id="slider"
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultval}
        onChange={handleChange}
      />
    </div>
  );
}
