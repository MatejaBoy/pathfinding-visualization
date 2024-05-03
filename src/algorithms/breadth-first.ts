import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import CommonFuncs, { Point } from "./common-func";

export default class BreadthFirstSearch {
  isSolving = false;
  queue: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];
  visitedNodes: NodeInterface[] = [];
  startPoint: Point = { x: 0, y: 0 };
  startTimePerf = 0;
  stopTimePerf = 0;
  nodes: NodeInterface[][] = [];
  isFinishFound = false;

  async startSearch(input_nodes: NodeInterface[][], startPoint: Point) {
    this.nodes = Array.from(input_nodes);
    this.queue = [];
    this.routeNodes = [];
    this.visitedNodes = [];
    this.isSolving = true;
    this.startPoint = JSON.parse(JSON.stringify(startPoint));
    this.isFinishFound = false;
    const startTime = performance.now();
    let found = await this.breadthFirstSearch(this.nodes, startPoint);
    if (found !== null) await this.bfsBackTrack(found!, this.nodes);
    const endTime = performance.now() - startTime;
    return { visitedNodes: this.visitedNodes, routeNodes: this.routeNodes, time: endTime };
  }

  stopSolving() {
    this.isSolving = false;
  }

  async bfsBackTrack(checkNode: NodeInterface, nodes: NodeInterface[][]): Promise<boolean> {
    if (!this.isSolving) return false;

    if (checkNode.x === this.startPoint.x && checkNode.y === this.startPoint.y) {
      this.stopTimePerf = performance.now();
      return true;
    }

    let adjacents = this.findAdjacentsBacktrack(this.visitedNodes, checkNode);
    let currentBestNode = adjacents[0];
    for (let i = 0; i < adjacents.length; i++) {
      if (adjacents[i].depth < currentBestNode.depth) {
        currentBestNode = adjacents[i];
      }
    }
    if (true) this.routeNodes.push(currentBestNode);
    return this.bfsBackTrack(currentBestNode, nodes);
  }

  async breadthFirstSearch(nodes: NodeInterface[][], startPoint: Point): Promise<NodeInterface | null> {
    if (!this.isSolving) return null;

    const currentNode = nodes[startPoint.y][startPoint.x];
    if (currentNode.type === PathPointType.Finish) {
      return currentNode;
    }

    if (currentNode.type === PathPointType.Start) {
      this.queue.push(currentNode);
      this.startTimePerf = performance.now();
    }

    currentNode.visited = true;
    this.visitedNodes.push(currentNode);

    const adjacents = CommonFuncs.findAdjacents(nodes, startPoint.x, startPoint.y);

    for (const adjacent of adjacents) {
      if (adjacent.type != PathPointType.Wall && !adjacent.visited && !adjacent.isAddedToQue) {
        adjacent.isAddedToQue = true;
        adjacent.depth = currentNode.depth + 1;
        this.queue.push(adjacent);
      }
    }
    this.queue.shift();

    if (this.queue[0] === undefined || this.queue === null) {
      return null;
    }

    return this.breadthFirstSearch(nodes, { x: this.queue[0].x, y: this.queue[0].y });
  }

  findAdjacentsBacktrack(nodes: NodeInterface[], checkNode: NodeInterface) {
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
