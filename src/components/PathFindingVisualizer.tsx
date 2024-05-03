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
import PFVisualizer from "../algorithms/visualizer.ts";
import SolveTimeDisplay from "./SolveTimeDisplay.tsx";

export interface NodeInterface {
  id: number;
  x: number;
  y: number;
  type: PathPointType;
  visited: boolean;
  isAddedToQue: boolean;
  depth: number;
  isTestOnProp: boolean;
  isRouteNode: boolean;
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
  solvespeed: number;
  currentAlgorithm: Algorithms;
  isDraggingWall: boolean;
  dragData: DragData | null;
  isVisualizingState: boolean;
  hasVisFound: boolean;
  solveTime: number;
  isInfoBoxVisible: boolean;
}

export enum PathPointType {
  Normal,
  Wall,
  Start,
  Finish,
  SpacerNode,
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
  defaultSpeed: number = 100;
  currentSpeed: number = 100;
  defaultStartNode: Point = { x: 1, y: 5 };
  defaultFinishNode: Point = { x: 14, y: 5 };
  nodes: NodeInterface[][] = [];
  startNode?: Point = undefined;
  finishNode?: Point = undefined;
  isSolving: boolean = false;
  search: any = null;
  visualizer: any = null;
  isVisualizing: boolean = false;
  needTimeout: boolean = true;

  constructor(props: any) {
    super(props);
    this.state = {
      solvespeed: 1,
      currentAlgorithm: Algorithms.AS,
      isDraggingWall: false,
      dragData: null,
      isVisualizingState: false,
      hasVisFound: false,
      solveTime: 0,
      isInfoBoxVisible: true,
    };
  }

  setSpeed = (speed: number) => {
    this.currentSpeed = speed;
    if (this.visualizer !== null) this.visualizer.setSolverSpeed(speed);
  };

  customSetState = () => {
    this.setState({});
  };

  clearAndRestartSolve = () => {
    this.resetSearch(ResetType.clearsolution, false);
    this.startSolving();
  };

  startSolving = async () => {
    if (this.startNode === undefined || this.finishNode === undefined) return;
    const alg = this.state.currentAlgorithm;
    let clear;
    if (this.search !== null) this.search.stopSolving();
    this.search = null;
    if (this.visualizer !== null) this.visualizer.stopVisualize();
    this.visualizer = null;

    if (alg === Algorithms.BFS) this.search = new BreadthFirstSearch();
    else if (alg === Algorithms.DFS) this.search = new DepthFirstSearch(false);
    else if (alg === Algorithms.IDDFS) {
      this.search = new DepthFirstSearch(true);
      clear = (stopV: boolean) => {
        this.resetSearch(ResetType.clearsolution, false, stopV);
      };
    } else if (alg === Algorithms.WD) this.search = new Dijkstra();
    else if (alg === Algorithms.AS) this.search = new Astar();

    if (this.search === null) return;
    let results = await this.search.startSearch(
      this.nodes,
      this.startNode,
      this.finishNode
    );
    if (results === null) return;
    this.setSolveTime(results.time);
    this.visualizer = new PFVisualizer();
    await this.visualizer.visualizeResults(
      results,
      this.customSetState,
      this.currentSpeed,
      true,
      clear
    );
  };

  stopSolving = () => {
    this.isSolving = false;
  };

  setAlgorithm = (alg: Algorithms) => {
    this.setState({ currentAlgorithm: alg }, () => {});
    this.resetSearch(ResetType.clearsolution, true);
  };

  handleClickOnRoute = (nodeInfo: [number, number, number], dir: string) => {
    if (this.isSolving) return;
    if (
      this.state.currentAlgorithm !== Algorithms.WD &&
      this.state.currentAlgorithm !== Algorithms.AS
    )
      return;
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

  setPointType = (
    nodeInfo: Point,
    type: PathPointType,
    _prevType: PathPointType
  ) => {
    //if (this.isSolving) return;

    if (type === PathPointType.Start) {
      this.nodes[this.startNode!.y][this.startNode!.x].type =
        PathPointType.Normal;
      this.startNode = nodeInfo;
      this.nodes[nodeInfo.y][nodeInfo.x].type = type;
      if (this.state.isVisualizingState && this.isVisualizing)
        this.clearAndRestartSolve();
    } else if (type === PathPointType.Finish) {
      this.nodes[this.finishNode!.y][this.finishNode!.x].type =
        PathPointType.Normal;
      this.finishNode = nodeInfo;
      this.nodes[nodeInfo.y][nodeInfo.x].type = type;
      if (this.state.isVisualizingState && this.isVisualizing)
        this.clearAndRestartSolve();
    } else if (type === PathPointType.Wall || type === PathPointType.Normal) {
      this.nodes[nodeInfo.y][nodeInfo.x].type = type;
    }
    this.setState({});
  };

  setDragData = (data: DragData | null) => {
    this.setState({
      dragData: data,
    });
  };

  componentDidMount(): void {
    this.createGrid();
    window.addEventListener("resize", this.onWindowSizeChange);
    return;
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.onWindowSizeChange);
  }

  onWindowSizeChange = () => {
    this.createGrid();
  };

  createGrid() {
    let width = window.innerWidth;
    if (!this.state.isInfoBoxVisible) width += 400;
    this.gridsize.x = Math.round(width / 85);

    this.defaultFinishNode.x = this.gridsize.x - 2;
    let node_list = [];
    let node_rows = [];
    let current_id = 0;
    for (let row = 0; row < this.gridsize.y; row++) {
      for (let col = 0; col < this.gridsize.x; col++) {
        let nodeType = PathPointType.Normal;
        if (
          col === this.defaultStartNode.x &&
          row === this.defaultStartNode.y
        ) {
          nodeType = PathPointType.Start;
          this.startNode = { x: col, y: row };
        } else if (
          col === this.defaultFinishNode.x &&
          row === this.defaultFinishNode.y
        ) {
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
          isRouteNode: false,
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
    this.nodes = node_list;
    this.setState({});
  }

  resetSearch = async (
    type: ResetType,
    resettimeout: boolean,
    skipStop?: boolean
  ) => {
    this.stopSolving();
    if (skipStop) null;
    else {
      if (this.search !== null) this.search.stopSolving();
      if (this.visualizer !== null) this.visualizer.stopVisualize();
    }
    this.needTimeout = resettimeout;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[i].length; j++) {
        const n = this.nodes[i][j];
        n.isRightRoutePath = false;
        n.isBottomRoutePath = false;
        n.isAddedToQue = false;
        n.isTestOnProp = false;
        n.visited = false;
        n.isRouteNode = false;
        n.depth = 0;
        n.toAnimate = false;

        if (type === ResetType.clearsolution) {
          continue;
        } else if (type === ResetType.resetgrid) {
          n.type = PathPointType.Normal;
        } else if (type === ResetType.cleargrid) {
          n.type =
            n.type === PathPointType.Wall ? PathPointType.Normal : n.type;
        }
        n.rightRouteWeight = 1;
        n.bottomRouteWeight = 1;
      }
    }

    if (type === ResetType.resetgrid) {
      this.setState({ isVisualizingState: false });
      this.isVisualizing = false;
      this.setPointType(
        this.defaultStartNode,
        PathPointType.Start,
        PathPointType.Normal
      );
      this.setPointType(
        this.defaultFinishNode,
        PathPointType.Finish,
        PathPointType.Normal
      );
    }
    this.setState({});
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
    this.setDragData(null);
  };

  setIsVisualizing = (isVis: boolean) => {
    this.isVisualizing = isVis;
    this.setState({ isVisualizingState: isVis }, () => {
      if (!this.state.hasVisFound && this.state.isVisualizingState) {
        this.clearAndRestartSolve();
      }
      if (!this.state.isVisualizingState) {
        this.search.stopSolving();
        this.visualizer.stopVisualize();
      }
    });
  };

  setSolveTime = (time: number) => {
    this.setState({ solveTime: Math.round(time * 10) / 10 });
  };

  setRowNum = (inc: boolean) => {
    if (!inc && this.gridsize.y > 6) this.gridsize.y--;
    else if (inc) this.gridsize.y++;
    this.createGrid();
  };

  setInfoBoxVisiblity = () => {
    this.setState(
      { isInfoBoxVisible: !this.state.isInfoBoxVisible },
      this.createGrid
    );
  };

  render() {
    return (
      <div className={this.getMainClassName()}>
        <Navbar
          setAlg={this.setAlgorithm}
          resetSearch={this.resetSearch}
          startSolving={this.startSolving}
          stopSolving={this.stopSolving}
          isVisualizing={this.state.isVisualizingState}
          setIsVisualizing={this.setIsVisualizing}
          setRowNum={this.setRowNum}
          setInfoBoxVis={this.setInfoBoxVisiblity}
          isInfoBoxVis={this.state.isInfoBoxVisible}
        />
        <div id="mainbody">
          <div hidden={!this.state.isInfoBoxVisible} className="main-col-1">
            <Infocontainer
              algorithm={this.state.currentAlgorithm}
              setalg={this.setAlgorithm}
            />
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
            <SolveTimeDisplay solvetimeProps={this.state.solveTime} />
            <SliderComponent
              onchange={this.setSpeed}
              defaultval={this.defaultSpeed}
              max={100}
              min={10}
              step={10}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PathFindingVisualizer;
