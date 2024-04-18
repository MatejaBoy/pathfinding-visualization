import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import CommonFuncs from "./common-func";

let queue: NodeInterface[] = [];
let routeNodes: NodeInterface[] = [];
let visitedNodes: NodeInterface[] = [];

let maxTimeout = 1000;
let minTimeout = 10;
let solverTimeout: number;
let startTime = 0;
let startTimePerf = 0;
let stopTime = 0;
let stopTimePerf = 0;

export default class BreadthFirstSearch {
  static isSolving = false;

  static startBreadthFirstSearch(
    nodes: NodeInterface[][],
    startPoint: { x: number; y: number },
    setstate: Function,
    defaultSpeed: number
  ) {
    if (solverTimeout === undefined) this.setSolverSpeed(defaultSpeed);

    queue = [];
    routeNodes = [];
    visitedNodes = [];
    this.isSolving = true;
    this.breadthFirstSearch(nodes, startPoint, setstate);
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

  static async visualizeBFS(setstate: Function) {
    // Visualize visited nodes
    for (const node of visitedNodes) {
      await CommonFuncs.timeout(25);
      node.toAnimate = true;
      setstate();
    }

    routeNodes.reverse();
    // Visualize route nodes
    for (const node of routeNodes) {
      await CommonFuncs.timeout(25);
      node.type = PathPointType.RouteNode;
      setstate();
    }
  }

  // Function for creating a little delay for visualization purposes
  static timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  // After we found finish node with the first recursing algorithm, we start backstracking to
  // the Start node while choosing the the cells with the lowest distance from the Start node
  static async findShortestRoute(checkNode: NodeInterface, nodes: NodeInterface[][], setstate: Function) {
    if (!this.isSolving) return;
    console.log("find shortest runs");
    // Exit clause to exit the recursion if we get back to the Start node
    if (checkNode.type === PathPointType.Start) {
      console.warn("BFS has finished, starting visualization");
      stopTime = new Date().getTime();
      stopTimePerf = performance.now();
      console.log(stopTime);
      console.log("Time it took to run the find the route: " + (stopTime - startTime));
      console.log("Time it took to run the find the route with perf: " + (stopTimePerf - startTimePerf));
      this.visualizeBFS(setstate);
      return;
    }

    //await BreadthFirstSearch.timeout(50);
    // Finding the adjacents of the current node that we are checking
    // We only search through the visited nodes to make it faster
    let adjacents = BreadthFirstSearch.findAdjacentsBacktrack(visitedNodes, checkNode);

    // We set the first element of the adjacents list as the current best node,
    // then we iterate through the rest and check if there's a better choice.
    // Then we push the best node to the best nodes list.
    let currentBestNode = adjacents[0];
    for (let i = 0; i < adjacents.length; i++) {
      if (adjacents[i].depth < currentBestNode.depth) {
        currentBestNode = adjacents[i];
      }
    }

    // If the node we're currently checking isn't the Finish node,
    //we set it's type to RouteNode, so it will have a different color.
    const checkNodeFromNodes = nodes[checkNode.y][checkNode.x];
    //if (checkNodeFromNodes.type != PathPointType.Finish) checkNodeFromNodes.type = PathPointType.RouteNode;
    //if (checkNodeFromNodes.type != PathPointType.Start)
    if (currentBestNode.type != PathPointType.Start) routeNodes.push(currentBestNode);

    // Lastly we update the screen for visualization,
    // then we start the recursion the the current node
    //setstate();
    BreadthFirstSearch.findShortestRoute(currentBestNode, nodes, setstate);
  }

  // First part of the breadth-first search algorithm:
  // Finding the Finish point and each visited node of
  // value based on their distance from the start node
  static async breadthFirstSearch(nodes: NodeInterface[][], startPoint: { x: number; y: number }, setstate: Function) {
    if (!this.isSolving) return;
    let start_x = startPoint.x;
    let start_y = startPoint.y;
    const currentNode = nodes[start_y][start_x];

    // If the current node we're checking is the Finish node we exit the recursion
    // and start the second part of this algorithm, finding the shortest route back to the Start node
    if (currentNode.type === PathPointType.Finish) {
      console.log("Finish node found");
      BreadthFirstSearch.findShortestRoute(currentNode, nodes, setstate);
      return null;
    }

    // If the current node is tha Start node we push it to the queue so
    // later on it won't be an issue shifting the array (removing the first element).
    if (currentNode.type === PathPointType.Start) {
      queue.push(currentNode);
      startTime = new Date().getTime();
      startTimePerf = performance.now();
      console.log("breadth_first_search_running");
    }

    // We set the current node to visited and push it into an array
    currentNode.visited = true;
    visitedNodes.push(currentNode);

    // We find all the adjacent nodes of the current node and iterate through them
    // The ones that haven't been visited and aren't in the queue, we add to the queue
    const adjacents = BreadthFirstSearch.findAdjacents(nodes, start_x, start_y);

    for (const adjacent of adjacents) {
      if (adjacent.type != PathPointType.Wall && !adjacent.visited && !adjacent.isAddedToQue) {
        adjacent.isAddedToQue = true;
        adjacent.depth = currentNode.depth + 1;
        queue.push(adjacent);
      }
    }

    console.log("Queue: ");
    for (const queueElements of queue) {
      console.log(queueElements.x + ", " + queueElements.y);
    }

    // We add little delay in the code for better visualization
    // await BreadthFirstSearch.timeout(solverTimeout);

    // Updating the currant state
    //setstate();

    // Removing the current element from the queue, since it's already checked
    queue.shift();

    // If there's no more node to check we stop the searching it's impossible to find the finish node
    if (queue[0] === undefined || queue === null) {
      console.log("There's no route to the finish node :(");
      return null;
    }

    BreadthFirstSearch.breadthFirstSearch(nodes, { x: queue[0].x, y: queue[0].y }, setstate);
    return null;
  }

  // Function for finding the neighbouring elements of the given node
  // Input is the 2D array

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

  // Fucntion for finding the neiughbouring elements of the given node
  // Input is a 1D array
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
