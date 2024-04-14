import React, { useEffect, useState } from "react";
import "../App.tsx";
import "./style.css";
import { PathPointType } from "./PathFindingVisualizer.tsx";

interface NodeProps {
  id: number;
  x: number;
  y: number;
  nodeTypeProp: PathPointType;
  isVisitedProp: boolean;
  depthProp: number;
  isTestOnProp: boolean;
  weight: number;
  clickOnNode: (nodeInfo: [number, number, number], drag: boolean) => void;
  clickOnRoute: (nodeInfo: [number, number, number], dir: string) => void;
  isLastRow: boolean;
  isLastCol: boolean;
  rightRouteWeightProp: number;
  bottomRouteWeightProp: number;
  isRightRoutePathProp: boolean;
  isBottomRoutePathProp: boolean;
}

export default function Node(node: NodeProps) {
  const [nodeType, setNodeType] = useState(node.nodeTypeProp);
  const [isVisited, setIsVisited] = useState(node.isVisitedProp);
  //const [depth, setDepth] = useState(depthProp);
  const [isTest, setIsTest] = useState(node.isTestOnProp);
  const [rightRouteWidth, setRigthRouteWidth] = useState(node.rightRouteWeightProp);
  const [bottomRouteWidth, setBottomRouteWidth] = useState(node.bottomRouteWeightProp);
  const [isRightRoutePath, setIsRightRoutePath] = useState(node.isRightRoutePathProp);
  const [isBottomRoutePath, setIsBottomRoutePath] = useState(node.isBottomRoutePathProp);

  function handleClick() {
    node.clickOnNode([node.id, node.x, node.y], false);
  }

  function handleClickOnRoute(dir: string) {
    node.clickOnRoute([node.id, node.x, node.y], dir);
  }

  // Handling dragging the mouse over a Node
  // -- calling clickOnNode with drag=true --
  function onMouseMouseOver(e: React.MouseEvent) {
    if (e.buttons) {
      node.clickOnNode([node.id, node.x, node.y], true);
    }
  }

  // When the prop nodeTypeProp changes,
  // we set the state variable nodeType to the new nodeTypeProp value

  useEffect(() => {
    setNodeType(node.nodeTypeProp);
  }, [node.nodeTypeProp]);

  useEffect(() => {
    setIsVisited(node.isVisitedProp);
  }, [node.isVisitedProp]);

  /*useEffect(() => {
    setDepth(depthProp);
  }, [depthProp]);*/

  useEffect(() => {
    setIsTest(node.isTestOnProp);
  }, [node.isTestOnProp]);

  useEffect(() => {
    setRigthRouteWidth(node.rightRouteWeightProp);
  }, [node.rightRouteWeightProp]);

  useEffect(() => {
    setBottomRouteWidth(node.bottomRouteWeightProp);
  }, [node.bottomRouteWeightProp]);

  useEffect(() => {
    setIsRightRoutePath(node.isRightRoutePathProp);
  }, [node.isRightRoutePathProp]);

  useEffect(() => {
    setIsBottomRoutePath(node.isBottomRoutePathProp);
  }, [node.isBottomRoutePathProp]);

  function getClassModifier() {
    switch (nodeType) {
      case PathPointType.Normal:
        return "normal";
      case PathPointType.Wall:
        return "wall";
      case PathPointType.Start:
        return "start";
      case PathPointType.Finish:
        return "finish";
      case PathPointType.RouteNode:
        return "routenode";
    }
  }

  function getVisitedModifier() {
    if (isVisited == true) return "visited";
    if (isTest == true) return "testcolor";
    else return "";
  }

  function getClassModifierRightRoute() {
    if (!isRightRoutePath) {
      return "_" + rightRouteWidth.toString();
    } else {
      return "_" + rightRouteWidth.toString() + " routepath";
    }
  }
  function getClassModifierBottomRoute() {
    if (!isBottomRoutePath) return "_" + bottomRouteWidth.toString();
    else return "_" + bottomRouteWidth.toString() + " routepath";
  }

  let styleRight = {
    display: node.isLastCol ? "none" : "block",
  };
  let styleBottom = {
    display: node.isLastRow ? "none" : "block",
  };

  let returnDiv = (
    <div className="tilewrapper">
      <div
        className={"tile" + " " + getClassModifier() + " " + getVisitedModifier()}
        key={node.id}
        onMouseOver={onMouseMouseOver}
        onMouseDown={handleClick}
      ></div>
      <div
        style={styleRight}
        onClick={() => handleClickOnRoute("right")}
        className={"route_right" + " " + getClassModifierRightRoute()}
      ></div>
      <div
        style={styleBottom}
        onClick={() => handleClickOnRoute("bottom")}
        className={"route_bottom" + " " + getClassModifierBottomRoute()}
      ></div>
    </div>
  );

  return <>{returnDiv}</>;
}

export const MemoizedNode = React.memo(Node);
