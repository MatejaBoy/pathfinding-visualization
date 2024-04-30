import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import NodeMinHeap, { NodeMinHeapInterface } from "../data_struct/heap";
import CommonFuncs, { Point } from "./common-func";

export default class Astar {
  heap: NodeMinHeap = new NodeMinHeap();
  visitedNodes: NodeMinHeapInterface[] = [];
  visitedNodes2: NodeInterface[] = [];
  routeNodes: NodeInterface[] = [];
  isSolving = true;

  async startSearch(nodes: NodeInterface[][], startPoint: Point, finishPoint: Point) {
    console.log("Startin A* search");
    // Clear the previous solution
    this.visitedNodes = [];
    this.heap = new NodeMinHeap();
    this.heap.insert({ x: startPoint.x, y: startPoint.y, dist: 0, prev: undefined });

    // Start the search
    this.isSolving = true;
    let found = await this.AstarSearch(nodes, startPoint, finishPoint);
    console.log(found);
    if (found !== null) await this.aStarBacktrack(nodes, found.x, found.y);
    return { visitedNodes: this.visitedNodes2, routeNodes: this.routeNodes };
  }

  stopSolving() {
    this.isSolving = false;
  }

  // Manhattan distance
  calcHeuristics(curr: Point, goal: Point) {
    return 1 * (Math.abs(curr.x - goal.x) + Math.abs(curr.y - goal.y));
  }

  async AstarSearch(nodes: NodeInterface[][], startPoint: Point, finishPoint: Point) {
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

        //* Cost (f) = Distance from start to node(g) + Distance from node to goal(h)
        let g = this.heap.arr[0].dist + distanceBetweenNodes;
        let h = this.calcHeuristics({ x: adj.x, y: adj.y }, { x: finishPoint.x, y: finishPoint.y });
        let adjCost = g + h;

        const adjIndex = this.heap.findByCoords(adj.x, adj.y);
        if (adjIndex === -1) {
          if (!adj.visited)
            this.heap.insert({ x: adj.x, y: adj.y, dist: adjCost, prev: { x: currentNode.x, y: currentNode.y } });
        } else if (adjCost < this.heap.arr[adjIndex].dist) {
          this.heap.arr[adjIndex].prev = { x: currentNode.x, y: currentNode.y };
          this.heap.decreaseKey(adjIndex, adjCost);
        }
      }

      let min = this.heap.extractMin();
      this.visitedNodes.push(min!);
      this.visitedNodes2.push(nodes[min!.y][min!.x]);

      if (currentNode.type === PathPointType.Finish) {
        console.log("Finish found");
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

  async aStarBacktrack(nodes: NodeInterface[][], x: number, y: number) {
    if (!this.isSolving) return;
    let currentNode = nodes[y][x];

    while (currentNode.type !== PathPointType.Start && this.isSolving) {
      for (const element of this.visitedNodes) {
        if (element.x === currentNode.x && element.y === currentNode.y) {
          let prev_x = element.prev!.x;
          let prev_y = element.prev!.y;
          /*
          if (prev_x === currentNode.x - 1) nodes[prev_y][prev_x].isRightRoutePath = true;
          else if (prev_x === currentNode.x + 1) currentNode.isRightRoutePath = true;
          else if (prev_y === currentNode.y - 1) nodes[prev_y][prev_x].isBottomRoutePath = true;
          else currentNode.isBottomRoutePath = true;*/

          if (nodes[element.y][element.x].type !== PathPointType.Finish)
            this.routeNodes.push(nodes[element.y][element.x]);
          currentNode = nodes[prev_y][prev_x];
        }
      }
    }
  }
}
