import { Component } from "react";
import BreadthFirstSearch from "../algorithms/breadth-first.ts";
import DepthFirstSearch from "../algorithms/depth-first.ts";
import Navbar from "./Navbar.tsx";
import SliderComponent from "./Slider.tsx";
import Dijkstra from "../algorithms/dijkstra.ts";
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

export interface SearchResults {
  visitedNodes: NodeInterface[];
  routeNodes: NodeInterface[];
}

export interface DragData {
  nodetype: PathPointType;
  prevNode: Point;
}

interface PathFindingVisualizerState {
  // nodes: NodeInterface[][];
  // startNode?: { x: number; y: number };
  // finishNode?: { x: number; y: number };
  isSHeld: boolean;
  isFHeld: boolean;
  solvespeed: number;
  currentAlgorithm: Algorithms;
  isDraggingWall: boolean;
  dragData: DragData | null;
  isVisualizing: boolean;
  hasVisFound: boolean;
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

export enum ResetType {
  resetgrid,
  cleargrid,
  clearsolution,
}

class PathFindingVisualizer extends Component<{}, PathFindingVisualizerState> {
  gridsize: { x: number; y: number } = { x: 16, y: 11 };
  defaultSpeed: number = 90;
  defaultStartNode: Point = { x: 1, y: 5 };
  defaultFinishNode: Point = { x: 14, y: 5 };
  nodes: NodeInterface[][] = [];
  startNode?: Point = undefined;
  finishNode?: Point = undefined;
  isSolving: boolean = false;

  constructor(props: any) {
    super(props);
    this.state = {
      //nodes: [],

      // startNode: undefined,
      // finishNode: undefined,
      isSHeld: false,
      isFHeld: false,
      solvespeed: 1,
      currentAlgorithm: Algorithms.BFS,
      isDraggingWall: false,
      dragData: null,
      isVisualizing: false,
      hasVisFound: false,
    };
  }

  setSpeed = (speed: number) => {
    DepthFirstSearch.setSolverSpeed(speed);
    BreadthFirstSearch.setSolverSpeed(speed);
    Dijkstra.setSolverSpeed(speed);
    Astar.setSolverSpeed(speed);
  };

  customSetState = () => {
    this.setState({});
  };

  clearAndRestartSolve = () => {
    this.resetSearch(ResetType.clearsolution);
    console.log(this.startNode);
    this.startSolving();
  };
  startSolving = async () => {
    if (this.startNode === undefined || this.finishNode === undefined) {
      return;
    }
    //this.setState({ isSolving: true });
    console.log("solving starts");

    type searchParams = [
      nodes: NodeInterface[][],
      startPoint: { x: number; y: number },
      setstate: Function,
      defaultSpeed: number
    ];
    let results: SearchResults | null = { visitedNodes: [], routeNodes: [] };
    const searchArgs: searchParams = [this.nodes, this.startNode!, this.customSetState, this.defaultSpeed];
    if (this.state.currentAlgorithm === Algorithms.BFS) {
      results = await BreadthFirstSearch.startBreadthFirstSearch(...searchArgs);
      if (results === null) return;
      CommonFuncs.visualizeResults(results, this.customSetState);
    } else if (this.state.currentAlgorithm === Algorithms.DFS)
      DepthFirstSearch.startDepthFirstSearch(...searchArgs, false);
    else if (this.state.currentAlgorithm === Algorithms.IDDFS)
      DepthFirstSearch.startDepthFirstSearch(...searchArgs, true);
    else if (this.state.currentAlgorithm === Algorithms.WD) Dijkstra.startDijkstraSearch(...searchArgs);
    else if (this.state.currentAlgorithm === Algorithms.AS) Astar.startAstarSearch(...searchArgs, this.finishNode);
  };

  stopSolving = () => {
    this.isSolving = false;
    Dijkstra.setSolving(false);
    DepthFirstSearch.stopSolving();
    BreadthFirstSearch.stopSolving();
    Astar.setSolving(false);
  };

  setAlgorithm = (alg: Algorithms) => {
    this.setState({ currentAlgorithm: alg }, () => {});
    this.resetSearch(ResetType.clearsolution);
  };

  handleClickOnRoute = (nodeInfo: [number, number, number], dir: string) => {
    console.log("Click on route");
    if (this.isSolving) return;
    if (this.state.currentAlgorithm !== Algorithms.WD && this.state.currentAlgorithm !== Algorithms.AS) return;
    const currentNode = this.nodes[nodeInfo[2]][nodeInfo[1]];

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

  setPointType = (nodeInfo: Point, type: PathPointType, prevType: PathPointType) => {
    if (this.isSolving) return;
    const currentNode = this.nodes[nodeInfo.y][nodeInfo.x];
    currentNode.type = type;
    if (type === PathPointType.Normal) {
      if (prevType === PathPointType.Start) this.startNode = undefined;
      if (prevType === PathPointType.Finish) this.finishNode = undefined;
      // if (prevType === PathPointType.Start) this.setState({ startNode: undefined });
      // if (prevType === PathPointType.Finish) this.setState({ finishNode: undefined });
    } else if (type === PathPointType.Start) {
      console.log("runs");
      this.startNode = nodeInfo;
      this.clearAndRestartSolve();
    } else if (type === PathPointType.Finish) {
      this.finishNode = nodeInfo;
    } else if (type === PathPointType.Wall) {
    }
    this.setState({});
  };

  setDragData = (data: DragData | null) => {
    //console.log("Set drag: ");
    //console.log(data);
    this.setState({
      dragData: data,
    });
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
        let nodeType = PathPointType.Normal;
        if (col === this.defaultStartNode.x && row === this.defaultStartNode.y) {
          nodeType = PathPointType.Start;
          //this.setState({ startNode: { x: col, y: row } });
          this.startNode = { x: col, y: row };
        } else if (col === this.defaultFinishNode.x && row === this.defaultFinishNode.y) {
          nodeType = PathPointType.Finish;
          this.finishNode = { x: col, y: row };
          // this.setState({ finishNode: { x: col, y: row } });
        } else nodeType = PathPointType.Normal;
        let currentNode: NodeInterface = {
          id: current_id,
          x: col,
          y: row,
          type: nodeType,
          visited: false,
          depth: 0,
          isAddedToQue: false,
          isTestOnProp: false,
          weight: CommonFuncs.getRandomInt(20),
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
    //this.setState({ nodes: node_list });
    this.nodes = node_list;
    this.setState({});
  }

  resetSearch = async (type: ResetType) => {
    this.stopSolving();
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].length; j++) {
        const n = this.nodes[i][j];
        n.isRightRoutePath = false;
        n.isBottomRoutePath = false;
        n.isAddedToQue = false;
        n.isTestOnProp = false;
        n.visited = false;
        n.depth = 0;
        n.toAnimate = false;

        if (type === ResetType.clearsolution) {
          continue;
        } else if (type === ResetType.resetgrid) {
          n.type = PathPointType.Normal;
        } else if (type === ResetType.cleargrid) {
          n.type = n.type === (PathPointType.Wall || PathPointType.RouteNode) ? PathPointType.Normal : n.type;
        }
        n.rightRouteWeight = 1;
        n.bottomRouteWeight = 1;
      }
    }

    // this.isSolving = false;

    // this.setState({ startNode: undefined, finishNode: undefined, isSolving: false });
    if (type === ResetType.resetgrid) {
      this.setPointType(this.defaultStartNode, PathPointType.Start, PathPointType.Normal);
      this.setPointType(this.defaultFinishNode, PathPointType.Finish, PathPointType.Normal);
      this.startNode = this.defaultStartNode;
      this.finishNode = this.defaultFinishNode;
    }
  };

  getMainClassName = () => {
    if (this.state.dragData !== null) {
      return "dragging _" + this.state.dragData.nodetype;
    } else {
      return "";
    }
  };

  cancelDragging = () => {
    if (this.state.dragData === null) return;
    /*this.setPointType(
      { x: this.state.dragData.prevNode.x, y: this.state.dragData.prevNode.y },
      this.state.dragData.nodetype,
      PathPointType.Normal
    );*/
    this.setDragData(null);
  };

  setIsVisualizing = (isVis: boolean) => {
    console.log(this.state.isVisualizing);
    this.setState({ isVisualizing: isVis }, () => {
      if (!this.state.hasVisFound) {
        this.startSolving();
      }
    });
  };

  render() {
    return (
      <div className={this.getMainClassName()}>
        <Navbar
          setAlg={this.setAlgorithm}
          resetSearch={this.resetSearch}
          startSolving={this.startSolving}
          stopSolving={this.stopSolving}
          isVisualizing={this.state.isVisualizing}
          setIsVisualizing={this.setIsVisualizing}
        />
        <div id="mainbody">
          <div className="main-col-1">
            <Infocontainer algorithm={this.state.currentAlgorithm} setalg={this.setAlgorithm} />
          </div>
          <div className="main-col-2">
            <Maingrid
              nodes={this.nodes}
              clickOnRoute={this.handleClickOnRoute}
              setNodeType={this.setPointType}
              setDragData={this.setDragData}
              dragData={this.state.dragData}
              isDraggingWall={this.state.isDraggingWall}
              cancelDrag={this.cancelDragging}
            />
          </div>
          <div className="main-col-3">
            <SliderComponent onchange={this.setSpeed} defaultval={this.defaultSpeed} max={100} min={10} step={10} />
          </div>
        </div>
      </div>
    );
  }
}

export default PathFindingVisualizer;
