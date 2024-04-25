import { useEffect, useState } from "react";
import { NodeInterface, PathPointType } from "./PathFindingVisualizer";
import { MemoizedNode } from "./Node";
import { Point } from "../algorithms/common-func";

interface MaingridProps {
  nodes: NodeInterface[][];
  clickOnNode: (nodeInfo: [number, number, number], drag: boolean) => void;
  clickOnRoute: (nodeInfo: [number, number, number], dir: string) => void;
  dropOnNode: () => void;
  setNodeType: Function;
  setDragData: (on: boolean, type: PathPointType | null) => void;
  isDraggingNode: boolean;
  dragData: PathPointType | null;
  mouseLeaveMainGrid: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Maingrid(props: MaingridProps) {
  const [nodes, setNodes] = useState(props.nodes);

  useEffect(() => {
    setNodes(props.nodes);
  }, [props.nodes]);

  return (
    <>
      <div onMouseLeave={props.mouseLeaveMainGrid} key={"maingrid"} id="maingrid" className="">
        {nodes.map((nodeRow, rowIndex) => {
          return (
            <div key={rowIndex} className="gridrow">
              {nodeRow.map((node) => {
                return (
                  <MemoizedNode
                    key={node.id}
                    id={node.id}
                    x={node.x}
                    y={node.y}
                    nodeTypeProp={node.type}
                    isVisitedProp={node.visited}
                    depthProp={node.depth}
                    isTestOnProp={node.isTestOnProp}
                    weight={node.weight}
                    clickOnNode={props.clickOnNode}
                    setNodeType={props.setNodeType}
                    clickOnRoute={props.clickOnRoute}
                    dropOnNode={props.dropOnNode}
                    setDragData={props.setDragData}
                    isLastRow={node.isLastRow}
                    isLastCol={node.isLastCol}
                    rightRouteWeightProp={node.rightRouteWeight}
                    bottomRouteWeightProp={node.bottomRouteWeight}
                    isRightRoutePathProp={node.isRightRoutePath}
                    isBottomRoutePathProp={node.isBottomRoutePath}
                    toAnimateProp={node.toAnimate}
                    dragData={props.dragData}
                    isDraggingNode={props.isDraggingNode}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
