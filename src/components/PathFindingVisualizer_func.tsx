import { Component, createRef, useCallback, useEffect, useState } from "react";
import { MemoizedNode } from "./Node.tsx";
import Node from "./Node.1.tsx";
import breadthFirstSearch from "../algorithms/breadth-first.ts";
import depthFirstSearch from "../algorithms/depth-first.ts";

export interface NodeInterface {
  id: number;
  x: number;
  y: number;
  type: PathPointType;
  visited: boolean;
  isAddedToQue: boolean;
  depth: number;
}

export enum PathPointType {
  Normal,
  Wall,
  Start,
  Finish,
  RouteNode,
}

function PathFindingVisualizerFunc() {
  const gridSize = { x: 40, y: 18 };
  const [nodes, setNodes] = useState<NodeInterface[][]>([[]]);
  const [isSolving, setIsSolving] = useState(false);
  const [startNode, setStartNode] = useState<{ x: number; y: number } | null>(null);
  const [finishNode, setFinishNode] = useState<{ x: number; y: number } | null>(null);

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  function createNodeList() {
    let node_list = [];
    let node_rows = [];
    let current_id = 0;
    for (let row = 0; row < gridSize.y; row++) {
      for (let col = 0; col < gridSize.x; col++) {
        let currentNode: NodeInterface = {
          id: current_id,
          x: col,
          y: row,
          type: PathPointType.Normal,
          visited: false,
          depth: 0,
          isAddedToQue: false,
        };
        node_rows.push(currentNode);
        current_id++;
      }
      node_list.push(node_rows);
      node_rows = [];
    }
    setNodes(node_list);
  }

  function customNodeSetState(nodes: NodeInterface[][]) {
    setNodes(nodes);
  }

  useEffect(() => {
    console.log("createNodeList");
    createNodeList();
  }, []);

  function startSolving() {
    setIsSolving(true);
    //breadthFirstSearch(nodes, startNode!, customNodeSetState);
    depthFirstSearch(nodes, startNode!, customNodeSetState);
  }

  function stopSolving() {
    setIsSolving(false);
  }

  function setStartNodeGrid() {
    if (startNode != undefined) {
      nodes[startNode.y][startNode.x].type = PathPointType.Normal;
    }
    const randomY = getRandomInt(gridSize.y - 1);
    const randomX = getRandomInt(gridSize.x - 1);

    nodes[randomY][randomX].type = PathPointType.Start;
    setStartNode({ x: randomX, y: randomY });
  }

  function setFinishNodeGrid() {
    if (finishNode != undefined) {
      nodes[finishNode.y][finishNode.x].type = PathPointType.Normal;
    }
    const randomY = getRandomInt(gridSize.y);
    const randomX = getRandomInt(gridSize.x);

    nodes[randomY][randomX].type = PathPointType.Finish;
    setFinishNode({ x: randomX, y: randomY });
  }

  const handleClickNodeCallback = useCallback((nodeInfo: [number, number, number], drag: boolean) => {
    console.log("callback");
    handleClickOnNode(nodeInfo, drag);
  }, []);

  function handleClickOnNode(nodeInfo: [number, number, number], drag: boolean) {
    console.log("handClickOnNode");
    if (isSolving) return;
    let currentNode = nodes[nodeInfo[2]][nodeInfo[1]];
    //console.log("current node: " + currentNode);
    if (currentNode.type === PathPointType.Start) return;
    if (currentNode.type === PathPointType.Finish) return;

    if (currentNode.type === PathPointType.Normal) {
      const newNodes = [...nodes];
      newNodes[nodeInfo[2]][nodeInfo[1]].type = PathPointType.Wall;
      setNodes(newNodes);
    } else if (!drag && currentNode.type === PathPointType.Wall) {
      const newNodes = [...nodes];
      newNodes[nodeInfo[2]][nodeInfo[1]].type = PathPointType.Normal;
      setNodes(newNodes);
    }
  }

  return (
    <>
      <div key={"maingrid"} id="maingrid" className="">
        {nodes.map((nodeRow, rowIndex) => {
          return (
            <div key={rowIndex} className="gridrow">
              {nodeRow.map((node) => {
                const { id, x, y, type, visited, depth } = node;
                return (
                  <MemoizedNode
                    key={id}
                    id={id}
                    x={x}
                    y={y}
                    nodeTypeProp={type}
                    isVisitedProp={visited}
                    depthProp={depth}
                    clickOnNode={handleClickNodeCallback}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <button key={"setWallButton"}>TestButton</button>
      <button key={"setStartButton"} onClick={setStartNodeGrid}>
        Set start node
      </button>
      <button key={"setFinishButton"} onClick={setFinishNodeGrid}>
        Set finish node
      </button>
      <button key={"startSolvingButton"} onClick={startSolving}>
        Start solving
      </button>
      <button key={"stopSolvingButton"} onClick={stopSolving}>
        Stop solving
      </button>
    </>
  );
}

/*
class PathFindingVisualizer extends Component<{}, PathFindingVisualizerState> {
  gridsize: { x: number; y: number } = { x: 40, y: 18 };
  constructor(props: any) {
    super(props);
    this.state = {
      nodes: [],
      isSolving: false,
      startNode: undefined,
      finishNode: undefined,
    };
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  setStartNode = () => {
    if (this.state.startNode != undefined) {
      this.state.nodes[this.state.startNode.y][this.state.startNode.x].type =
        PathPointType.Normal;
    }
    const randomY = this.getRandomInt(this.gridsize.y - 1);
    const randomX = this.getRandomInt(this.gridsize.x - 1);

    this.state.nodes[randomY][randomX].type = PathPointType.Start;
    //this.state.nodes[7][0].type = PathPointType.Start;
    this.setState({
      startNode: { x: randomX, y: randomY },
      //startNode: { x: 0, y: 7 },
    });
  };

  customSetState = () => {
    this.setState({});
  };
  setFinishNode = () => {
    if (this.state.finishNode != undefined) {
      this.state.nodes[this.state.finishNode.y][this.state.finishNode.x].type =
        PathPointType.Normal;
    }
    const randomY = this.getRandomInt(this.gridsize.y);
    const randomX = this.getRandomInt(this.gridsize.x);

    this.state.nodes[randomY][randomX].type = PathPointType.Finish;
    //this.state.nodes[55][55].type = PathPointType.Finish;
    this.setState({
      finishNode: { x: randomX, y: randomY },
      //finishNode: { x: 55, y: 55 },
    });
  };
  startSolving = () => {
    this.setState({ isSolving: true });
    breadthFirstSearch(
      this.state.nodes,
      this.state.startNode!,

      this.customSetState
    );
  };

  stopSolving = () => {
    this.setState({ isSolving: false });
  };

  handleClickNodeCallback = useCallback(
    (nodeInfo: [number, number, number], drag: boolean) =>
      this.handleClickOnNode(nodeInfo, drag),
    []
  );

  handleClickOnNode = (nodeInfo: [number, number, number], drag: boolean) => {
    console.log("hadnleCLick");
    if (this.state.isSolving) return;
    const currentNode = this.state.nodes[nodeInfo[2]][nodeInfo[1]];
    if (currentNode.type === PathPointType.Start) return;
    if (currentNode.type === PathPointType.Finish) return;

    if (currentNode.type === PathPointType.Normal) {
      currentNode.type = PathPointType.Wall;
      this.setState({});
    } else if (!drag && currentNode.type === PathPointType.Wall) {
      currentNode.type = PathPointType.Normal;
      this.setState({});
    }
  };

  componentDidMount(): void {
    let node_list = [];
    let node_rows = [];
    let current_id = 0;
    for (let row = 0; row < this.gridsize.y; row++) {
      for (let col = 0; col < this.gridsize.x; col++) {
        let currentNode: NodeInterface = {
          id: current_id,
          x: col,
          y: row,
          type: PathPointType.Normal,
          visited: false,
          depth: 0,
          isAddedToQue: false,
        };
        node_rows.push(currentNode);
        current_id++;
      }
      node_list.push(node_rows);
      node_rows = [];
    }
    this.setState({ nodes: node_list });
  }

  setOneToVisited = () => {
    this.state.nodes[5][5].visited = true;
    this.setState({});
  };

  tryRef = () => {
    console.log();
  };

  render() {
    return (
      <>
        <div key={"maingrid"} id="maingrid" className="">
          {this.state.nodes.map((nodeRow, rowIndex) => {
            return (
              <div key={rowIndex} className="gridrow">
                {nodeRow.map((node) => {
                  const { id, x, y, type, visited, depth } = node;
                  return (
                    <MemoizedNode
                      key={id}
                      id={id}
                      x={x}
                      y={y}
                      nodeTypeProp={type}
                      isVisitedProp={visited}
                      depthProp={depth}
                      clickOnNode={this.handleClickOnNode}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <button key={"setWallButton"} onClick={this.setOneToVisited}>
          TestButton
        </button>
        <button key={"setStartButton"} onClick={this.setStartNode}>
          Set start node
        </button>
        <button key={"setFinishButton"} onClick={this.setFinishNode}>
          Set finish node
        </button>
        <button key={"startSolvingButton"} onClick={this.startSolving}>
          Start solving
        </button>
        <button key={"stopSolvingButton"} onClick={this.stopSolving}>
          Stop solving
        </button>
        <button key={"refButton"} onClick={this.tryRef}>
          Try ref
        </button>
      </>
    );
  }
}
*/
export default PathFindingVisualizerFunc;
