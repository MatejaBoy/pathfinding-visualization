import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import CommonFuncs, { Point } from "./common-func";

let startTimePerf = 0;
let stopTimePerf = 0;

export default class DepthFirstSearch {
  // Function for creating a little delay for visualization purposes
  searchCounter = 0;
  isSolving = true;
  finishnode: NodeInterface | null = null;
  visitedNodes: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];

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
  }

  async startDepthFirstSearch(nodes: NodeInterface[][], startPoint: { x: number; y: number }, deepening: boolean) {
    this.isSolving = true;
    const iterativeDeepening = deepening;
    let iteration = 1;
    let maxDepth;
    if (iterativeDeepening) maxDepth = 1;
    else maxDepth = Infinity;
    let found = null;

    while (true) {
      found = await this.depthFirstSearch(nodes, startPoint!, maxDepth * iteration);
      if (!iterativeDeepening || found !== null) break;
      this.resetSearchForIteration(nodes);
      iteration++;
    }

    if (found !== null) await this.dfsBacktrack(found, nodes);
    return { visitedNodes: this.visitedNodes, routeNodes: this.routeNodes };
  }

  async dfsBacktrack(checkNode: NodeInterface, nodes: NodeInterface[][]) {
    if (!this.isSolving) return false;
    console.log("dfs backtrack");
    if (checkNode.type === PathPointType.Start) {
      stopTimePerf = performance.now();
      // console.log(stopTime);
      // console.log("Time it took to run the find the route: " + (stopTime - startTime));
      // console.log("Time it took to run the find the route with perf: " + (stopTimePerf - startTimePerf));
      return;
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
    if (checkNodeFromNodes.type != PathPointType.Finish) this.routeNodes.push(checkNodeFromNodes);

    this.dfsBacktrack(currentBestNode!, nodes);
  }

  // First part of the breadth-first search algorithm:
  // Finding the Finish point and each visited node of
  // value based on their distance from the start node
  async depthFirstSearch(
    nodes: NodeInterface[][],
    startPoint: Point,
    depthLimit?: number
  ): Promise<NodeInterface | null> {
    if (!this.isSolving) return null;

    // Updating the current state
    let start_x = startPoint.x;
    let start_y = startPoint.y;
    const currentNode = nodes[start_y][start_x];
    this.searchCounter++;

    // If the current node we're checking is the Finish node we exit the recursion
    // and start the second part of this algorithm, finding the shortest route back to the Start node
    if (currentNode.type === PathPointType.Finish) {
      console.log("Finish node found");
      return currentNode;
    }

    if (currentNode.type === PathPointType.Start) {
      startTimePerf = performance.now();
      console.log("depth_first_search_running");
    }

    // We set the current node to visited and push it into an array
    currentNode.visited = true;
    this.visitedNodes.push(currentNode);
    if (currentNode.depth >= depthLimit!) return null;

    // We find all the adjacent nodes of the current node and iterate through them
    // The ones that haven't been visited and aren't in the queue, we add to the queue
    const adjacents = CommonFuncs.findAdjacents(nodes, start_x, start_y);
    console.log(adjacents);
    for (const adjacent of adjacents) {
      if (adjacent.type != PathPointType.Wall && !adjacent.visited) {
        adjacent.depth = currentNode.depth + 1;
        return await this.depthFirstSearch(nodes, { x: adjacent.x, y: adjacent.y }, depthLimit);
      }
    }
    return null;
  }
}
