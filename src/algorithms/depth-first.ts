import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import CommonFuncs, { Point } from "./common-func";

let startTimePerf = 0;
let stopTimePerf = 0;

export default class DepthFirstSearch {
  // Function for creating a little delay for visualization purposes

  constructor(iddfs: boolean) {
    this.iterativeDeepening = iddfs;
  }
  searchCounter = 0;
  isSolving = true;
  finishnode: NodeInterface | null = null;
  visitedNodes: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];
  iterativeDeepening: boolean;

  stopSolving() {
    this.isSolving = false;
  }

  resetSearchForIteration(nodes: NodeInterface[][]) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        nodes[i][j].isAddedToQue = false;
        nodes[i][j].isTestOnProp = false;
        nodes[i][j].visited = false;
        nodes[i][j].depth = 0;
      }
    }
    let spacerNode: NodeInterface = {
      id: 999999,
      x: 999,
      y: 999,
      type: PathPointType.SpacerNode,
      visited: false,
      depth: 0,
      isAddedToQue: false,
      isTestOnProp: false,
      weight: 0,
      isLastRow: false,
      isLastCol: false,
      isRouteNode: false,
      rightRouteWeight: 1,
      bottomRouteWeight: 1,
      isRightRoutePath: false,
      isBottomRoutePath: false,
      toAnimate: false,
    };
    this.visitedNodes.push(spacerNode);
  }

  async startSearch(nodes: NodeInterface[][], startPoint: { x: number; y: number }) {
    this.isSolving = true;

    let iteration = 1;
    let maxDepth;
    if (this.iterativeDeepening) maxDepth = 1;
    else maxDepth = Infinity;
    let found = null;

    const startTime = performance.now();
    while (true) {
      found = await this.depthFirstSearch(nodes, startPoint!, maxDepth * iteration);
      if (!this.iterativeDeepening || found !== null) break;
      this.resetSearchForIteration(nodes);
      iteration++;
    }

    if (found !== null) await this.dfsBacktrack(found, nodes);
    const endTime = performance.now() - startTime;
    return { visitedNodes: this.visitedNodes, routeNodes: this.routeNodes, time: endTime };
  }

  async dfsBacktrack(checkNode: NodeInterface, nodes: NodeInterface[][]): Promise<boolean> {
    if (!this.isSolving) return false;

    if (checkNode.type === PathPointType.Start) {
      stopTimePerf = performance.now();
      console.log("Time it took to run the find the route with perf: " + (stopTimePerf - startTimePerf));
      return true;
    }

    let adjacents = CommonFuncs.findAdjacents(nodes, checkNode.x, checkNode.y);
    let currentBestDepth = Infinity;
    let currentBestNode = null;
    for (let i = 0; i < adjacents.length; i++) {
      if (adjacents[i].depth < currentBestDepth && adjacents[i].visited) {
        currentBestNode = adjacents[i];
        currentBestDepth = adjacents[i].depth;
      }
    }

    const checkNodeFromNodes = nodes[checkNode.y][checkNode.x];
    this.routeNodes.push(checkNodeFromNodes);

    return this.dfsBacktrack(currentBestNode!, nodes);
  }
  async depthFirstSearch(
    nodes: NodeInterface[][],
    startPoint: Point,
    depthLimit?: number
  ): Promise<NodeInterface | null> {
    if (!this.isSolving) return null;

    let start_x = startPoint.x;
    let start_y = startPoint.y;
    const currentNode = nodes[start_y][start_x];
    this.searchCounter++;

    if (currentNode.type === PathPointType.Finish) {
      console.log("Finish node found");
      return currentNode;
    }

    if (currentNode.type === PathPointType.Start) {
      startTimePerf = performance.now();
      // console.log("depth_first_search_running");
    }

    currentNode.visited = true;
    this.visitedNodes.push(currentNode);
    if (currentNode.depth >= depthLimit!) return null;

    const adjacents = CommonFuncs.findAdjacents(nodes, start_x, start_y);
    for (const adjacent of adjacents) {
      if (adjacent.type != PathPointType.Wall && !adjacent.visited) {
        adjacent.depth = currentNode.depth + 1;
        let found = await this.depthFirstSearch(nodes, { x: adjacent.x, y: adjacent.y }, depthLimit);
        if (found !== null) return found;
      }
    }
    return null;
  }
}
