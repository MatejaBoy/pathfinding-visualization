import React, { useEffect, useState } from "react";
import { Algorithms } from "./PathFindingVisualizer";
import Texts from "../miscs/Text";

interface InfocontainerProps {
  algorithm: Algorithms;
  setalg: (alg: Algorithms) => void;
}

export default function Infocontainer(props: InfocontainerProps) {
  const [alg, setAlg] = useState(props.algorithm);

  useEffect(() => {
    setAlg(props.algorithm);
  }, [props.algorithm]);

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked) props.setalg(Algorithms.IDDFS);
    else props.setalg(Algorithms.DFS);
  }

  return (
    <>
      <div className="info-container">
        <h6 style={{ fontWeight: "600", textAlign: "center" }}>
          {Texts.returnTitle(alg)}
        </h6>
        <p>{Texts.returnDesc(alg)}</p>

        <div
          hidden={
            props.algorithm !== Algorithms.DFS &&
            props.algorithm !== Algorithms.IDDFS
          }
          className="checkbox-wrapper-24"
        >
          <input
            onChange={handleCheckboxChange}
            type="checkbox"
            id="check-24"
            name="check"
            value="asd"
          />
          <label htmlFor="check-24">
            <span></span>
            {Texts.idCheckBoxText}
          </label>
        </div>

        <h6 style={{ textAlign: "center" }}>{Texts.howtouse}</h6>
        <ul
          style={{
            marginBottom: "15px",
            listStyleType: "auto",
            textAlign: "justify",
            paddingLeft: 15,
          }}
        >
          <li>{Texts.step1}</li>
          <li>{Texts.step2}</li>
          <li hidden={alg != Algorithms.WD && alg != Algorithms.AS}>
            {Texts.step3}
          </li>
          <li>{Texts.step4}</li>
          <li>{Texts.step5}</li>
        </ul>
        <h6 style={{ textAlign: "center" }}>Hint:</h6>
        <span>{Texts.hint1}</span>
      </div>
    </>
  );
}

export const MemoizedInfocontainer = React.memo(Infocontainer);
