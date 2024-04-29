import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import NodeMinHeap, { NodeMinHeapInterface } from "../data_struct/heap";
import CommonFuncs, { Point } from "./common-func";

export default class Dijkstra {
  visitedNodes: NodeMinHeapInterface[] = [];
  visitedNodes2: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];

  heap: NodeMinHeap = new NodeMinHeap();

  isSolving: boolean = false;

  async startDijkstraSearch(nodes: NodeInterface[][], startPoint: Point, setstate: Function, defaultSpeed: number) {
    this.visitedNodes = [];
    this.visitedNodes2 = [];
    this.routeNodes = [];
    this.heap = new NodeMinHeap();
    this.heap.insert({ x: startPoint.x, y: startPoint.y, dist: 0, prev: undefined });
    this.isSolving = true;

    let found: NodeInterface | null = await this.dijkstraSearch(nodes, startPoint);
    if (found !== null) await this.dijkstraBacktrack(nodes, found.x, found.y);
    return { visitedNodes: this.visitedNodes2, routeNodes: this.routeNodes };
  }

  stopSolving() {
    this.isSolving = false;
  }

  async dijkstraBacktrack(nodes: NodeInterface[][], x: number, y: number) {
    if (!this.isSolving) return;
    let currentNode = nodes[y][x];

    while (currentNode.type !== PathPointType.Start) {
      for (const element of this.visitedNodes) {
        if (element.x === currentNode.x && element.y === currentNode.y) {
          let prev_x = element.prev!.x;
          let prev_y = element.prev!.y;

          if (prev_x === currentNode.x - 1) nodes[prev_y][prev_x].isRightRoutePath = true;
          else if (prev_x === currentNode.x + 1) currentNode.isRightRoutePath = true;
          else if (prev_y === currentNode.y - 1) nodes[prev_y][prev_x].isBottomRoutePath = true;
          else currentNode.isBottomRoutePath = true;

          if (nodes[element.y][element.x].type !== PathPointType.Finish)
            this.routeNodes.push(nodes[element.y][element.x]);
          currentNode = nodes[prev_y][prev_x];
        }
      }
    }
    return;
  }

  async dijkstraSearch(nodes: NodeInterface[][], startPoint: { x: number; y: number }) {
    if (!this.isSolving) return null;

    // When we start the search the current node is the start node
    let currentNode = nodes[startPoint.y][startPoint.x];

    // Repeating until the finish in found
    while (this.isSolving) {
      currentNode.visited = true;

      const adjacents = CommonFuncs.findAdjacents(nodes, currentNode.x, currentNode.y);

      for (let adj of adjacents) {
        if (adj.type === PathPointType.Wall) continue;

        let distanceBetweenNodes: number;
        if (adj.x === currentNode.x - 1) distanceBetweenNodes = adj.rightRouteWeight;
        else if (adj.x === currentNode.x + 1) distanceBetweenNodes = currentNode.rightRouteWeight;
        else if (adj.y === currentNode.y - 1) distanceBetweenNodes = adj.bottomRouteWeight;
        else distanceBetweenNodes = currentNode.bottomRouteWeight;

        let newDist = distanceBetweenNodes + this.heap.arr[0].dist;
        // Finding the index of the adjacents node in the Heap
        let adjHeapIndex = this.heap.findByCoords(adj.x, adj.y);
        if (adjHeapIndex === -1) {
          if (!adj.visited)
            this.heap.insert({ x: adj.x, y: adj.y, dist: newDist, prev: { x: currentNode.x, y: currentNode.y } });
        } else if (distanceBetweenNodes + this.heap.arr[0].dist < this.heap.arr[adjHeapIndex].dist) {
          this.heap.arr[adjHeapIndex].prev = { x: currentNode.x, y: currentNode.y };
          this.heap.decreaseKey(adjHeapIndex, distanceBetweenNodes + this.heap.arr[0].dist);
        }
      }

      let min = this.heap.extractMin();
      this.visitedNodes.push(min!);
      this.visitedNodes2.push(nodes[min!.y][min!.x]);

      if (currentNode.type === PathPointType.Finish) {
        console.log("Finish found");
        return currentNode;
      }

      const min_node = this.heap.getMin();
      currentNode = nodes[min_node.y][min_node.x];
    }
    return null;
  }
}
