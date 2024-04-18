import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import NodeMinHeap, { NodeMinHeapInterface } from "../data_struct/heap";
import CommonFuncs from "./common-func";

export default class Astar {
  static heap: NodeMinHeap;
  static isSolving = true;
  static visitedNodes: NodeMinHeapInterface[] = [];
  static solverTimeout: number;

  static startAstarSearch(
    nodes: NodeInterface[][],
    startPoint: { x: number; y: number },
    setstate: Function,
    defaultSpeed: number,
    finishPoint: { x: number; y: number }
  ) {
    console.log("Startin A* search");
    // Clear the previous solution
    this.visitedNodes = [];
    this.heap = new NodeMinHeap();
    if (this.solverTimeout === undefined) this.solverTimeout = defaultSpeed;
    // Populate the heap with the nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        let startNode = nodes[i][j].type === PathPointType.Start;
        this.heap.insert({ x: j, y: i, dist: startNode ? 0 : Infinity, prev: undefined });
      }
    }

    // Start the search
    this.setSolving(true);
    this.AstarSearch(nodes, startPoint, setstate, finishPoint);
  }

  static setSolving(val: boolean) {
    this.isSolving = val;
  }

  // Manhattan distance
  static calcHeuristics(curr: { x: number; y: number }, goal: { x: number; y: number }) {
    return 1 * (Math.abs(curr.x - goal.x) + Math.abs(curr.y - goal.y));
  }

  static async AstarSearch(
    nodes: NodeInterface[][],
    startPoint: { x: number; y: number },
    setstate: Function,
    finishPoint: { x: number; y: number }
  ) {
    let currentNode = nodes[startPoint.y][startPoint.x];
    while (this.isSolving) {
      // Little delay for better visualization
      await CommonFuncs.timeout(10);

      // For visualization
      currentNode.visited = true;
      setstate();

      const adjacents = this.findAdjacents(nodes, currentNode.x, currentNode.y);

      for (const adj of adjacents) {
        if (adj.type === PathPointType.Wall) continue;

        const adjIndex = this.heap.findByCoords(adj.x, adj.y);
        if (adjIndex === -1) continue;

        let distanceBetweenNodes: number;
        if (adj.x === currentNode.x - 1) distanceBetweenNodes = adj.rightRouteWeight;
        else if (adj.x === currentNode.x + 1) distanceBetweenNodes = currentNode.rightRouteWeight;
        else if (adj.y === currentNode.y - 1) distanceBetweenNodes = adj.bottomRouteWeight;
        else distanceBetweenNodes = currentNode.bottomRouteWeight;

        // Cost (f) = Distance from start to node(g) + Distance from node to goal(h)
        let g = this.heap.arr[0].dist + distanceBetweenNodes;
        let h = this.calcHeuristics({ x: adj.x, y: adj.y }, { x: finishPoint.x, y: finishPoint.y });
        let adjCost = g + h;

        if (adjCost < this.heap.arr[adjIndex].dist) {
          this.heap.arr[adjIndex].prev = { x: currentNode.x, y: currentNode.y };
          adj.depth = adjCost;
          this.heap.decreaseKey(adjIndex, adjCost);
        }
      }
      let min = this.heap.extractMin();
      this.visitedNodes.push(min!);

      // Check if we finished the algo

      if (currentNode.type === PathPointType.Finish) {
        console.log("Finish found");
        this.aStarBacktrack(nodes, currentNode.x, currentNode.y, setstate);
        return;
      }

      //If not

      let current = this.heap.getMin();
      currentNode = nodes[current.y][current.x];
    }
  }

  static async aStarBacktrack(nodes: NodeInterface[][], x: number, y: number, setstate: Function) {
    // Function is used to backtrack from the finish to
    // the start node using the nodes with the shortest dist
    if (!this.isSolving) return;
    let currentNode = nodes[y][x];

    // Looping until we find the Start node
    while (currentNode.type !== PathPointType.Start) {
      // Delay for visualization
      await CommonFuncs.timeout(100);

      // Looping through the visited nodes to find the current node
      // Its needed cause the visited nodes array contains the information
      // about the previous of the current node

      for (const element of this.visitedNodes) {
        if (element.x === currentNode.x && element.y === currentNode.y) {
          // Coordinates of the previous node
          let prev_x = element.prev!.x;
          let prev_y = element.prev!.y;

          if (prev_x === currentNode.x - 1) {
            // Left adj
            nodes[prev_y][prev_x].isRightRoutePath = true;
          } else if (prev_x === currentNode.x + 1) {
            // Right adj
            currentNode.isRightRoutePath = true;
          } else if (prev_y === currentNode.y - 1) {
            // Top adj
            nodes[prev_y][prev_x].isBottomRoutePath = true;
          } else {
            // Bottom adj
            currentNode.isBottomRoutePath = true;
          }

          if (nodes[element.y][element.x].type !== PathPointType.Finish)
            nodes[element.y][element.x].type = PathPointType.RouteNode;
          setstate();
          currentNode = nodes[prev_y][prev_x];
        }
      }
    }
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
}
