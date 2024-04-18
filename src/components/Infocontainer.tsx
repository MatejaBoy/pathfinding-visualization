import React, { useEffect, useState } from "react";
import { Algorithms } from "./PathFindingVisualizer";

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
    console.log(event.currentTarget.checked);
    if (event.currentTarget.checked) props.setalg(Algorithms.IDDFS);
    else props.setalg(Algorithms.DFS);
  }

  function getTitle() {
    let title;
    switch (alg) {
      case Algorithms.BFS:
        title = "Breadth First search";
        break;
      case Algorithms.DFS:
        title = "Depth First search";
        break;
      case Algorithms.IDDFS:
        title = (
          <>
            Depth First search <br /> with Iterative Deepening
          </>
        );
        break;
      case Algorithms.WD:
        title = "Weighted Dijkstra search";
        break;
      case Algorithms.AS:
        title = "A* search";
        break;
    }
    return title;
  }

  return (
    <>
      <div className="info-container">
        <h6 style={{ fontWeight: "600", textAlign: "center" }}>{getTitle()}</h6>
        <p>
          This algorithm is used in weighted graphs to find the shortest route from to start node to the finish node.
        </p>

        <div
          style={{ display: props.algorithm === Algorithms.DFS || props.algorithm === Algorithms.IDDFS ? "" : "none" }}
          className="checkbox-wrapper-24"
        >
          <input onChange={handleCheckboxChange} type="checkbox" id="check-24" name="check" value="asd" />
          <label htmlFor="check-24">
            <span></span>Iterative deepening
          </label>
        </div>

        <h6 style={{ textAlign: "center" }}>How to use:</h6>
        <ul style={{ marginBottom: "0", listStyleType: "auto", textAlign: "justify", paddingLeft: 15 }}>
          <li>Press the "Set start node" and "Set finish node" buttons to choose a random start and finish nodes</li>
          <li>Press on a node in the grid to set it to a wall</li>
          <li style={{ display: alg != Algorithms.WD ? "none" : "" }}>
            Press on a route between two nodes once or multiple times to increase its weight{" "}
          </li>
          <li>Press the "Start solving" button</li>
          <li>Use the "Speed" slider to set the solving speed</li>
        </ul>
      </div>
    </>
  );
}

export const MemoizedInfocontainer = React.memo(Infocontainer);
