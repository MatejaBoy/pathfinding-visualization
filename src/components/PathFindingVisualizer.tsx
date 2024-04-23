import { Component } from "react";
import BreadthFirstSearch from "../algorithms/breadth-first.ts";
import DepthFirstSearch from "../algorithms/depth-first.ts";
import Navbar from "./Navbar.tsx";
import SliderComponent from "./Slider.tsx";
import Dijkstra from "../algorithms/dijkstra.ts";
import ButtonRow from "./Buttonrow.tsx";
import Maingrid from "./Maingrid.tsx";
import Infocontainer from "./Infocontainer.tsx";
import CommonFuncs, { Point } from "../algorithms/common-func.ts";
import Astar from "../algorithms/Astar.ts";

export interface NodeInterface {
  id: number;
  x: number;
  y: number;
  type: PathPointType;
  visited: boolean;
  isAddedToQue: boolean;
  depth: number;
  isTestOnProp: boolean;
  weight: number;
  isLastRow: boolean;
  isLastCol: boolean;
  rightRouteWeight: number;
  bottomRouteWeight: number;
  isRightRoutePath: boolean;
  isBottomRoutePath: boolean;
  toAnimate: boolean;
}

interface PathFindingVisualizerState {
  nodes: NodeInterface[][];
  isSolving: boolean;
  startNode?: { x: number; y: number };
  finishNode?: { x: number; y: number };
  isSHeld: boolean;
  isFHeld: boolean;
  solvespeed: number;
  currentAlgorithm: Algorithms;
}

export enum PathPointType {
  Normal,
  Wall,
  Start,
  Finish,
  RouteNode,
}

export enum Algorithms {
  BFS,
  DFS,
  IDDFS,
  WD,
  AS,
}

class PathFindingVisualizer extends Component<{}, PathFindingVisualizerState> {
  gridsize: { x: number; y: number } = { x: 16, y: 10 };
  defaultSpeed: number = 90;
  constructor(props: any) {
    super(props);
    this.state = {
      nodes: [],
      isSolving: false,
      startNode: undefined,
      finishNode: undefined,
      isSHeld: false,
      isFHeld: false,
      solvespeed: 1,
      currentAlgorithm: Algorithms.BFS,
    };
  }

  setSpeed = (speed: number) => {
    DepthFirstSearch.setSolverSpeed(speed);
    BreadthFirstSearch.setSolverSpeed(speed);
    Dijkstra.setSolverSpeed(speed);
    Astar.setSolverSpeed(speed);
  };

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  setStartNode = () => {
    if (this.state.startNode != undefined) {
      this.state.nodes[this.state.startNode.y][this.state.startNode.x].type = PathPointType.Normal;
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
      this.state.nodes[this.state.finishNode.y][this.state.finishNode.x].type = PathPointType.Normal;
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
    if (this.state.startNode === undefined || this.state.finishNode === undefined) return;
    this.setState({ isSolving: true });

    type searchParams = [
      nodes: NodeInterface[][],
      startPoint: { x: number; y: number },
      setstate: Function,
      defaultSpeed: number
    ];

    const searchArgs: searchParams = [this.state.nodes, this.state.startNode!, this.customSetState, this.defaultSpeed];
    if (this.state.currentAlgorithm === Algorithms.BFS) BreadthFirstSearch.startBreadthFirstSearch(...searchArgs);
    else if (this.state.currentAlgorithm === Algorithms.DFS)
      DepthFirstSearch.startDepthFirstSearch(...searchArgs, false);
    else if (this.state.currentAlgorithm === Algorithms.IDDFS)
      DepthFirstSearch.startDepthFirstSearch(...searchArgs, true);
    else if (this.state.currentAlgorithm === Algorithms.WD) Dijkstra.startDijkstraSearch(...searchArgs);
    else if (this.state.currentAlgorithm === Algorithms.AS)
      Astar.startAstarSearch(...searchArgs, this.state.finishNode);
  };

  stopSolving = () => {
    this.setState({ isSolving: false });
    Dijkstra.setSolving(false);
    DepthFirstSearch.stopSolving();
    BreadthFirstSearch.stopSolving();
    Astar.setSolving(false);
  };

  setAlgorithm = (alg: Algorithms) => {
    this.setState({ currentAlgorithm: alg });
    this.resetSearch();
  };

  handleClickOnNode = (nodeInfo: [number, number, number], drag: boolean) => {
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

  handleClickOnRoute = (nodeInfo: [number, number, number], dir: string) => {
    console.log("Click on route");
    if (this.state.isSolving) return;
    if (this.state.currentAlgorithm !== Algorithms.WD && this.state.currentAlgorithm !== Algorithms.AS) return;
    const currentNode = this.state.nodes[nodeInfo[2]][nodeInfo[1]];

    if (dir === "right") {
      if (currentNode.rightRouteWeight < 5) currentNode.rightRouteWeight++;
      else currentNode.rightRouteWeight = 1;
      this.setState({});
    }
    if (dir === "bottom") {
      if (currentNode.bottomRouteWeight < 5) currentNode.bottomRouteWeight++;
      else currentNode.bottomRouteWeight = 1;
      this.setState({});
    }
  };

  handleDropOnNode = () => {
    if (this.state.isSolving) return;
  };

  setPointType = (nodeInfo: Point, type: PathPointType) => {
    if (this.state.isSolving) return;
    this.state.nodes[nodeInfo.y][nodeInfo.x].type = type;
    this.setState({});
  };

  componentDidMount(): void {
    this.createGrid();
  }

  createGrid() {
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
          isTestOnProp: false,
          weight: this.getRandomInt(20),
          isLastRow: row < this.gridsize.y - 1 ? false : true,
          isLastCol: col < this.gridsize.x - 1 ? false : true,
          rightRouteWeight: 1,
          bottomRouteWeight: 1,
          isRightRoutePath: false,
          isBottomRoutePath: false,
          toAnimate: false,
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

  resetSearch = async () => {
    this.stopSolving();
    await CommonFuncs.timeout(100);
    for (let i = 0; i < this.state.nodes.length; i++) {
      for (let j = 0; j < this.state.nodes[i].length; j++) {
        const n = this.state.nodes[i][j];
        n.isAddedToQue = false;
        n.isTestOnProp = false;
        n.visited = false;
        n.depth = 0;
        n.type = PathPointType.Normal;
        n.rightRouteWeight = 1;
        n.bottomRouteWeight = 1;
        n.isBottomRoutePath = false;
        n.isRightRoutePath = false;
      }
    }

    this.setState({ startNode: undefined, finishNode: undefined, isSolving: false });
  };

  render() {
    return (
      <>
        <Navbar setAlg={this.setAlgorithm} />
        <div id="mainbody">
          <div className="main-col-1">
            <Infocontainer algorithm={this.state.currentAlgorithm} setalg={this.setAlgorithm} />
          </div>
          <div className="main-col-2">
            <ButtonRow
              setStartNode={this.setStartNode}
              setFinishNode={this.setFinishNode}
              resetSearch={this.resetSearch}
              startSolving={this.startSolving}
              stopSolving={this.stopSolving}
            />
            <Maingrid
              nodes={this.state.nodes}
              clickOnNode={this.handleClickOnNode}
              clickOnRoute={this.handleClickOnRoute}
              dropOnNode={this.handleDropOnNode}
              setNodeType={this.setPointType}
            />
          </div>
          <div className="main-col-3">
            <SliderComponent onchange={this.setSpeed} defaultval={this.defaultSpeed} max={100} min={10} step={10} />
          </div>
        </div>
      </>
    );
  }
}

export default PathFindingVisualizer;
