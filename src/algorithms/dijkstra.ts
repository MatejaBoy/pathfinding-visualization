import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import NodeMinHeap, { NodeMinHeapInterface } from "../miscs/heap";
import CommonFuncs, { Point } from "./common-func";

export default class Dijkstra {
  visitedNodes: NodeMinHeapInterface[] = [];
  visitedNodes2: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];

  heap: NodeMinHeap = new NodeMinHeap();

  isSolving: boolean = false;

  constructor() {
    console.log("new Dijkstra created");
  }

  async startSearch(nodes: NodeInterface[][], startPoint: Point) {
    this.visitedNodes = [];
    this.visitedNodes2 = [];
    this.routeNodes = [];
    this.heap = new NodeMinHeap();
    this.heap.insert({ x: startPoint.x, y: startPoint.y, f_val: 0, g_val: 0, h_val: 0, prev: undefined });
    this.isSolving = true;

    const startTime = performance.now();
    let found: NodeInterface | null = await this.dijkstraSearch(nodes, startPoint);
    if (found !== null) await this.dijkstraBacktrack(nodes, found.x, found.y);
    const endTime = performance.now() - startTime;
    return { visitedNodes: this.visitedNodes2, routeNodes: this.routeNodes, time: endTime };
  }

  stopSolving() {
    this.isSolving = false;
  }

  async dijkstraSearch(nodes: NodeInterface[][], startPoint: { x: number; y: number }) {
    if (!this.isSolving) return null;

    let currentNode = nodes[startPoint.y][startPoint.x];

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

        let adjCost = distanceBetweenNodes + this.heap.arr[0].f_val;
        // Finding the index of the adjacents node in the Heap

        const adjHeapIndex = this.heap.findByCoords(adj.x, adj.y);
        if (adjHeapIndex === -1) {
          if (!adj.visited) {
            this.heap.insert({
              x: adj.x,
              y: adj.y,
              f_val: adjCost,
              g_val: 0,
              h_val: 0,
              prev: { x: currentNode.x, y: currentNode.y },
            });
            nodes[adj.y][adj.x].depth = adjCost;
          }
        } else if (adjCost < this.heap.arr[adjHeapIndex].f_val) {
          this.heap.arr[adjHeapIndex].prev = { x: currentNode.x, y: currentNode.y };
          this.heap.decreaseKey(adjHeapIndex, adjCost);
          nodes[adj.y][adj.x].depth = adjCost;
        }
      }

      let min = this.heap.extractMin();
      this.visitedNodes.push(min!);
      this.visitedNodes2.push(nodes[min!.y][min!.x]);

      if (currentNode.type === PathPointType.Finish) {
        return currentNode;
      }

      if (this.heap.arr.length < 1) {
        console.warn("Finish Node cannot be reached!");
        this.stopSolving();
        return null;
      }
      const min_node = this.heap.getMin();
      currentNode = nodes[min_node.y][min_node.x];
    }
    return null;
  }

  async dijkstraBacktrack(nodes: NodeInterface[][], x: number, y: number) {
    if (!this.isSolving) return;
    let currentNode = nodes[y][x];

    while (currentNode.type !== PathPointType.Start && this.isSolving) {
      for (const element of this.visitedNodes) {
        if (element.x === currentNode.x && element.y === currentNode.y) {
          let prev_x = element.prev!.x;
          let prev_y = element.prev!.y;

          /*if (prev_x === currentNode.x - 1) nodes[prev_y][prev_x].isRightRoutePath = true;
          else if (prev_x === currentNode.x + 1) currentNode.isRightRoutePath = true;
          else if (prev_y === currentNode.y - 1) nodes[prev_y][prev_x].isBottomRoutePath = true;
          else currentNode.isBottomRoutePath = true;*/

          if (nodes[element.y][element.x].type !== PathPointType.Finish)
            this.routeNodes.push(nodes[element.y][element.x]);
          currentNode = nodes[prev_y][prev_x];
        }
      }
    }
    return;
  }
}
