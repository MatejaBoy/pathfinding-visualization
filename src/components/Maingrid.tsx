import { useEffect, useState } from "react";
import { DragData, NodeInterface } from "./PathFindingVisualizer";
import { MemoizedNode } from "./Node";

interface MaingridProps {
  nodes: NodeInterface[][];
  clickOnRoute: (nodeInfo: [number, number, number], dir: string) => void;
  setNodeType: Function;
  setDragData: (data: DragData | null) => void;
  isDraggingWall: boolean;
  dragData: DragData | null;
  cancelDrag: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Maingrid(props: MaingridProps) {
  const [nodes, setNodes] = useState(props.nodes);

  useEffect(() => {
    setNodes(props.nodes);
  }, [props.nodes]);

  return (
    <>
      <div onMouseLeave={props.cancelDrag} onMouseUp={props.cancelDrag} key={"maingrid"} id="maingrid" className="">
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
                    isRouteNodeProp={node.isRouteNode}
                    weight={node.weight}
                    setNodeType={props.setNodeType}
                    clickOnRoute={props.clickOnRoute}
                    setDragData={props.setDragData}
                    isLastRow={node.isLastRow}
                    isLastCol={node.isLastCol}
                    rightRouteWeightProp={node.rightRouteWeight}
                    bottomRouteWeightProp={node.bottomRouteWeight}
                    isRightRoutePathProp={node.isRightRoutePath}
                    isBottomRoutePathProp={node.isBottomRoutePath}
                    toAnimateProp={node.toAnimate}
                    dragData={props.dragData}
                    isDraggingWall={props.isDraggingWall}
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
