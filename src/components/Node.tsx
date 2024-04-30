import React, { useEffect, useState } from "react";
import "../App.tsx";
import "./style.css";
import { DragData, PathPointType } from "./PathFindingVisualizer.tsx";

interface NodeProps {
  id: number;
  x: number;
  y: number;
  nodeTypeProp: PathPointType;
  isVisitedProp: boolean;
  depthProp: number;
  isTestOnProp: boolean;
  isRouteNodeProp: boolean;
  weight: number;
  setNodeType: Function;
  clickOnRoute: (nodeInfo: [number, number, number], dir: string) => void;
  setDragData: (data: DragData | null) => void;
  isLastRow: boolean;
  isLastCol: boolean;
  rightRouteWeightProp: number;
  bottomRouteWeightProp: number;
  isRightRoutePathProp: boolean;
  isBottomRoutePathProp: boolean;
  toAnimateProp: boolean;
  isDraggingWall: boolean;
  dragData: DragData | null;
}

export default function Node(node: NodeProps) {
  const [nodeType, setNodeType] = useState(node.nodeTypeProp);
  const [isTest, setIsTest] = useState(node.isTestOnProp);
  const [isRouteNode, setIsRouteNode] = useState(node.isRouteNodeProp);
  const [rightRouteWidth, setRigthRouteWidth] = useState(node.rightRouteWeightProp);
  const [bottomRouteWidth, setBottomRouteWidth] = useState(node.bottomRouteWeightProp);
  const [isRightRoutePath, setIsRightRoutePath] = useState(node.isRightRoutePathProp);
  const [isBottomRoutePath, setIsBottomRoutePath] = useState(node.isBottomRoutePathProp);
  const [toAnimate, setToAnimate] = useState(node.toAnimateProp);
  const [isVisited, setIsVisited] = useState(node.isVisitedProp);
  const [depth, setDepth] = useState(node.depthProp);

  useEffect(() => {
    setToAnimate(node.toAnimateProp);
  }, [node.toAnimateProp]);

  useEffect(() => {
    setNodeType(node.nodeTypeProp);
  }, [node.nodeTypeProp]);

  useEffect(() => {
    setIsVisited(node.isVisitedProp);
  }, [node.isVisitedProp]);

  useEffect(() => {
    setIsRouteNode(node.isRouteNodeProp);
  }, [node.isRouteNodeProp]);

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

  useEffect(() => {
    setDepth(node.depthProp);
  }, [node.depthProp]);
  // Handling dragging the mouse over a Node
  // -- calling clickOnNode with drag=true --
  async function onMouseMouseOver(e: React.MouseEvent) {
    if (node.dragData !== null && e.buttons) {
      if (nodeType === node.dragData.nodetype) return;
      node.setNodeType({ x: node.x, y: node.y }, node.dragData!.nodetype);
      node.setDragData({ nodetype: node.dragData.nodetype, prevNode: { x: node.x, y: node.y } });
      return;
    }
    if (e.buttons && nodeType === PathPointType.Normal) {
      // SETTING TO WALL BY DRAG
      if (nodeType === PathPointType.Normal) node.setNodeType({ x: node.x, y: node.y }, PathPointType.Wall);
    }
  }

  function onMouseDown() {
    if (nodeType === PathPointType.Start || nodeType === PathPointType.Finish) return;
    if (nodeType === PathPointType.Normal) node.setNodeType({ x: node.x, y: node.y }, PathPointType.Wall);
    if (nodeType === PathPointType.Wall) node.setNodeType({ x: node.x, y: node.y }, PathPointType.Normal);
  }

  function handleClickOnRoute(dir: string) {
    node.clickOnRoute([node.id, node.x, node.y], dir);
  }

  function onMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
    if (nodeType !== PathPointType.Start && nodeType != PathPointType.Finish) return;
    if (event.buttons) node.setDragData({ nodetype: nodeType, prevNode: { x: node.x, y: node.y } });
  }

  function getVisualizerModifier() {
    if (isTest && toAnimate) return "testcolor";
    else if (isRouteNode && toAnimate) return "routenode";
    else if (isVisited && toAnimate == true) return "visited";
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
    }
  }

  let returnDiv = (
    <div className="tilewrapper">
      <div
        className={"tile" + " " + getClassModifier() + " " + getVisualizerModifier()}
        key={node.id}
        onMouseOver={onMouseMouseOver}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
      >
        {depth}
      </div>
      <div
        style={{
          display: node.isLastCol ? "none" : "block",
        }}
        onClick={() => handleClickOnRoute("right")}
        className={"route_right" + " " + getClassModifierRightRoute()}
      ></div>
      <div
        style={{
          display: node.isLastRow ? "none" : "block",
        }}
        onClick={() => handleClickOnRoute("bottom")}
        className={"route_bottom" + " " + getClassModifierBottomRoute()}
      ></div>
    </div>
  );

  return <>{returnDiv}</>;
}

export const MemoizedNode = React.memo(Node);
