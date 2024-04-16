import React, { useEffect, useState } from "react";
import { Algorithms } from "./PathFindingVisualizer";
import { getDialogTitleUtilityClass } from "@mui/joy";

interface InfocontainerProps {
  algorithm: Algorithms;
}

export default function Infocontainer(props: InfocontainerProps) {
  const [alg, setAlg] = useState(props.algorithm);
  useEffect(() => {
    setAlg(props.algorithm);
  }, [props.algorithm]);

  function getTitle() {
    let title = "";
    switch (alg) {
      case Algorithms.BFS:
        title = "Breadt-first search";
        break;
      case Algorithms.DFS:
        title = "Depth-first search";
        break;
      case Algorithms.WD:
        title = "Weighted Dijkstra search";
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

        <h6 style={{ textAlign: "center" }}>How to use:</h6>
        <ul style={{ marginBottom: "0", listStyleType: "auto", textAlign: "justify", paddingLeft: 15 }}>
          <li>Press the "Set start node" and "Set finish node" buttons to choose a random start and finish nodes</li>
          <li>Press on a node in the grid to set it to a wall</li>
          <li>Press on a route between two nodes once or multiple times to increase its weight </li>
          <li>Press the "Start solving" button</li>
          <li>Use the "Speed" slider to set the solving speed</li>
        </ul>
      </div>
    </>
  );
}

export const MemoizedInfocontainer = React.memo(Infocontainer);
