import { NodeInterface, PathPointType, SearchResults } from "../components/PathFindingVisualizer";
import CommonFuncs, { Point } from "./common-func";

export default class BreadthFirstSearch {
  isSolving = false;
  queue: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];
  visitedNodes: NodeInterface[] = [];
  startPoint: Point = { x: 0, y: 0 };

  maxTimeout = 1000;
  minTimeout = 10;
  solverTimeout = 0;
  startTimePerf = 0;
  stopTimePerf = 0;
  nodes: NodeInterface[][] = [];

  async startBreadthFirstSearch(input_nodes: NodeInterface[][], startPoint: Point): Promise<SearchResults | null> {
    this.nodes = Array.from(input_nodes);
    this.queue = [];
    this.routeNodes = [];
    this.visitedNodes = [];
    this.isSolving = true;
    this.startPoint = JSON.parse(JSON.stringify(startPoint));
    let found = await this.breadthFirstSearch(this.nodes, startPoint);
    if (found === null) return null;
    let go = await this.bfsBackTrack(found!, this.nodes);
    if (!go) return null;
    return { visitedNodes: this.visitedNodes, routeNodes: this.routeNodes };
  }

  stopSolving() {
    this.isSolving = false;
  }

  setSolverSpeed(percent: number) {
    this.solverTimeout = CommonFuncs.mapFromRangeToRange(
      percent,
      { min: 10, max: 100 },
      { min: this.maxTimeout, max: this.minTimeout }
    );
  }

  async bfsBackTrack(checkNode: NodeInterface, nodes: NodeInterface[][]): Promise<boolean> {
    if (!this.isSolving) return false;

    if (checkNode.x === this.startPoint.x && checkNode.y === this.startPoint.y) {
      this.stopTimePerf = performance.now();
      // console.log("BFS has finished, starting visualization");
      // console.log("Time it took to run the find the route with perf: " + (this.stopTimePerf - this.startTimePerf));
      return true;
    }

    let adjacents = BreadthFirstSearch.findAdjacentsBacktrack(this.visitedNodes, checkNode);
    let currentBestNode = adjacents[0];
    for (let i = 0; i < adjacents.length; i++) {
      if (adjacents[i].depth < currentBestNode.depth) {
        currentBestNode = adjacents[i];
      }
    }
    //if (checkNode.x !== this.startPoint.x && checkNode.y !== this.startPoint.y) this.routeNodes.push(currentBestNode);
    if (true) this.routeNodes.push(currentBestNode);

    return this.bfsBackTrack(currentBestNode, nodes);
  }

  async breadthFirstSearch(nodes: NodeInterface[][], startPoint: Point): Promise<NodeInterface | null> {
    if (!this.isSolving) return null;

    const currentNode = nodes[startPoint.y][startPoint.x];
    if (currentNode.type === PathPointType.Finish) {
      //("Finish node found, calling backtrack");
      return currentNode;
    }

    if (currentNode.type === PathPointType.Start) {
      this.queue.push(currentNode);
      this.startTimePerf = performance.now();
      //console.log("breadth_first_search_running");
    }

    currentNode.visited = true;
    this.visitedNodes.push(currentNode);

    const adjacents = BreadthFirstSearch.findAdjacents(nodes, startPoint.x, startPoint.y);

    for (const adjacent of adjacents) {
      if (adjacent.type != PathPointType.Wall && !adjacent.visited && !adjacent.isAddedToQue) {
        adjacent.isAddedToQue = true;
        adjacent.depth = currentNode.depth + 1;
        this.queue.push(adjacent);
      }
    }
    this.queue.shift();

    if (this.queue[0] === undefined || this.queue === null) {
      //console.log("There's no route to the finish node :(");
      return null;
    }

    return this.breadthFirstSearch(nodes, { x: this.queue[0].x, y: this.queue[0].y });
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
