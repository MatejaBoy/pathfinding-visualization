import { NodeInterface, PathPointType, SearchResults } from "../components/PathFindingVisualizer";
import CommonFuncs from "./common-func";

let queue: NodeInterface[] = [];
let routeNodes: NodeInterface[] = [];
let visitedNodes: NodeInterface[] = [];

let maxTimeout = 1000;
let minTimeout = 10;
let solverTimeout: number;
let startTimePerf = 0;
let stopTimePerf = 0;
let nodes: NodeInterface[][] = [];

export default class BreadthFirstSearch {
  static isSolving = false;

  static async startBreadthFirstSearch(
    input_nodes: NodeInterface[][],
    startPoint: { x: number; y: number },
    setstate: Function,
    defaultSpeed: number
  ): Promise<SearchResults | null> {
    nodes = Array.from(input_nodes);
    queue = [];
    routeNodes = [];
    visitedNodes = [];
    this.isSolving = true;
    let found = await this.breadthFirstSearch(nodes, startPoint, setstate);
    if (found === null) return null;
    let go = await BreadthFirstSearch.bfsBackTrack(found!, nodes, setstate);
    if (!go) return null;
    return { visitedNodes: visitedNodes, routeNodes: routeNodes };

    //this.visualizeBFS(setstate);
  }

  static stopSolving() {
    this.isSolving = false;
  }

  static setSolverSpeed(percent: number) {
    console.log("Percent: " + percent);
    solverTimeout = CommonFuncs.mapFromRangeToRange(
      percent,
      { min: 10, max: 100 },
      { min: maxTimeout, max: minTimeout }
    );
    console.log("Solver timeout: " + solverTimeout);
  }

  static async bfsBackTrack(checkNode: NodeInterface, nodes: NodeInterface[][], setstate: Function): Promise<boolean> {
    if (!this.isSolving) return false;

    if (checkNode.type === PathPointType.Start) {
      console.log("BFS has finished, starting visualization");
      stopTimePerf = performance.now();
      console.log("Time it took to run the find the route with perf: " + (stopTimePerf - startTimePerf));
      //this.visualizeBFS(setstate);
      return true;
    }

    let adjacents = BreadthFirstSearch.findAdjacentsBacktrack(visitedNodes, checkNode);
    let currentBestNode = adjacents[0];
    for (let i = 0; i < adjacents.length; i++) {
      if (adjacents[i].depth < currentBestNode.depth) {
        currentBestNode = adjacents[i];
      }
    }

    currentBestNode.isTestOnProp = true;
    currentBestNode.toAnimate = true;
    setstate();

    // await CommonFuncs.timeout(5000);
    if (nodes[checkNode.y][checkNode.x].type != PathPointType.Start) routeNodes.push(currentBestNode);

    return BreadthFirstSearch.bfsBackTrack(currentBestNode, nodes, setstate);
  }

  static async breadthFirstSearch(
    nodes: NodeInterface[][],
    startPoint: { x: number; y: number },
    setstate: Function
  ): Promise<NodeInterface | null> {
    if (!this.isSolving) return null;

    const currentNode = nodes[startPoint.y][startPoint.x];
    if (currentNode.type === PathPointType.Finish) {
      console.log("Finish node found, calling backtrack");
      return currentNode;
    }

    if (currentNode.type === PathPointType.Start) {
      queue.push(currentNode);
      startTimePerf = performance.now();
      console.log("breadth_first_search_running");
    }

    currentNode.visited = true;
    visitedNodes.push(currentNode);

    const adjacents = BreadthFirstSearch.findAdjacents(nodes, startPoint.x, startPoint.y);

    for (const adjacent of adjacents) {
      if (adjacent.type != PathPointType.Wall && !adjacent.visited && !adjacent.isAddedToQue) {
        adjacent.isAddedToQue = true;
        adjacent.depth = currentNode.depth + 1;
        queue.push(adjacent);
      }
    }
    queue.shift();

    if (queue[0] === undefined || queue === null) {
      console.log("There's no route to the finish node :(");
      return null;
    }

    return BreadthFirstSearch.breadthFirstSearch(nodes, { x: queue[0].x, y: queue[0].y }, setstate);
  }

  static findAdjacents(nodes: NodeInterface[][], base_x: number, base_y: number) {
    let adjacents: NodeInterface[] = [];
    const directions = [
      { dy: 0, dx: -1 }, // Left
      { dy: 0, dx: 1 }, // Right
      { dy: -1, dx: 0 }, // Up
      { dy: 1, dx: 0 }, // Down
    ];

    for (const dir of directions) {
      const ny = base_y + dir.dy;
      const nx = base_x + dir.dx;

      if (ny >= 0 && ny < nodes.length && nx >= 0 && nx < nodes[ny].length && nodes[ny][nx]) {
        adjacents.push(nodes[ny][nx]);
      }
    }
    return adjacents;
  }

  static findAdjacentsBacktrack(nodes: NodeInterface[], checkNode: NodeInterface) {
    let base_x = checkNode.x;
    let base_y = checkNode.y;
    let adjacents = [];
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(nodes[i].x - base_x) === 1 && nodes[i].y == base_y) {
        if (nodes[i].visited) adjacents.push(nodes[i]);
      } else if (Math.abs(nodes[i].y - base_y) === 1 && nodes[i].x == base_x) {
        if (nodes[i].visited) adjacents.push(nodes[i]);
      }
    }
    return adjacents;
  }
}
