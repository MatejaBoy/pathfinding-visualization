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

export default function Node({
  id,
  x,
  y,
  nodeTypeProp,
  isVisitedProp,
  //depthProp,
  isTestOnProp,
  //weight,
  clickOnNode,
  clickOnRoute,
  isLastRow,
  isLastCol,
  rightRouteWeightProp,
  bottomRouteWeightProp,
  isRightRoutePathProp,
  isBottomRoutePathProp,
}: NodeProps) {
  const [nodeType, setNodeType] = useState(nodeTypeProp);
  const [isVisited, setIsVisited] = useState(isVisitedProp);
  //const [depth, setDepth] = useState(depthProp);
  const [isTest, setIsTest] = useState(isTestOnProp);
  const [rightRouteWidth, setRigthRouteWidth] = useState(rightRouteWeightProp);
  const [bottomRouteWidth, setBottomRouteWidth] = useState(bottomRouteWeightProp);

  const [isRightRoutePath, setIsRightRoutePath] = useState(isRightRoutePathProp);
  const [isBottomRoutePath, setIsBottomRoutePath] = useState(isBottomRoutePathProp);

  function handleClick() {
    clickOnNode([id, x, y], false);
  }

  function handleClickOnRoute(dir: string) {
    clickOnRoute([id, x, y], dir);
  }

  // Handeling dragging the mouse over a Node
  // -- calling clickOnNode with drag=true --
  function onMouseMouseOver(e: React.MouseEvent) {
    if (e.buttons) {
      clickOnNode([id, x, y], true);
    }
  }

  // When the prop nodeTypeProp changes,
  // we set the state variable nodeType to the new nodeTypeProp value

  useEffect(() => {
    setNodeType(nodeTypeProp);
  }, [nodeTypeProp]);

  useEffect(() => {
    setIsVisited(isVisitedProp);
  }, [isVisitedProp]);

  /*useEffect(() => {
    setDepth(depthProp);
  }, [depthProp]);*/

  useEffect(() => {
    setIsTest(isTestOnProp);
  }, [isTestOnProp]);

  useEffect(() => {
    setRigthRouteWidth(rightRouteWeightProp);
  }, [rightRouteWeightProp]);

  useEffect(() => {
    setBottomRouteWidth(bottomRouteWeightProp);
  }, [bottomRouteWeightProp]);

  useEffect(() => {
    setIsRightRoutePath(isRightRoutePathProp);
  }, [isRightRoutePathProp]);

  useEffect(() => {
    setIsBottomRoutePath(isBottomRoutePathProp);
  }, [isBottomRoutePathProp]);

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
    display: isLastCol ? "none" : "block",
  };
  let styleBottom = {
    display: isLastRow ? "none" : "block",
  };

  let returnDiv = (
    <div className="tilewrapper">
      <div
        className={"tile" + " " + getClassModifier() + " " + getVisitedModifier()}
        key={id}
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

/*export default class Node extends Component<NodeProps, {}> {
  constructor(props: NodeProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <div className="tile" key={this.props.id}>
          [ {this.props.x} , {this.props.y}]
        </div>
      </>
    );
  }
}
*/
