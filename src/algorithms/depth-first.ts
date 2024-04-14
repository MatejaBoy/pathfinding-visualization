import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";
import CommonFuncs from "./common-func";


let solverTimeout: number;
let maxTimeout = 1000;
let minTimeout = 10;
let startTime = 0;
let startTimePerf = 0;
let stopTime = 0;
let stopTimePerf = 0;


export default class DepthFirstSearch 
{
// Function for creating a little delay for visualization purposes

 static setSolverSpeed(percent:number) {
    console.log("Percent: " + percent);
    solverTimeout = CommonFuncs.mapFromRangeToRange(percent, {min:10, max:100}, {min:maxTimeout, max:minTimeout});
    console.log("Solver timeout: " + solverTimeout)
}

static resetSearchForIteration(nodes:NodeInterface[][], setstate:Function){
    for (let i = 0 ; i < nodes.length;i++){
        for (let j = 0; j < nodes[i].length; j++){
            nodes[i][j].isAddedToQue = false;
            nodes[i][j].isTestOnProp = false;
            nodes[i][j].visited = false;
            nodes[i][j].depth = 0;
        } 
    }
    setstate();
}

  static async startDepthFirstSearch(nodes:NodeInterface[][], startPoint:{x:number,y:number}, setstate:Function, defaultSpeed:number){
    const iterativeDeepening = true;
    let iteration = 1;
    let maxDepth = 1;
    let pathFound = false

    if (solverTimeout===undefined) this.setSolverSpeed(defaultSpeed);

    while (!pathFound) {
         pathFound = await this.depthFirstSearch(
            nodes,
            startPoint!,
            setstate,
            maxDepth * iteration
        );
        if (!iterativeDeepening || pathFound){
            return;
        }
        this.resetSearchForIteration(nodes, setstate);
        iteration++;
    }

    console.log("Can find solution: " + pathFound);
}


// After we found finish node with the first recursing algorithm, we start backstracking to 
// the Start node while choosing the the cells with the lowest distance from the Start node
static async findShortestRoute(checkNode:NodeInterface, nodes:NodeInterface[][], setstate:Function){
    console.log("find shortest runs")
    // Exit clause to exit the recursion if we get back to the Start node
    if (checkNode.type === PathPointType.Start){
        stopTime = new Date().getTime();
        stopTimePerf =  performance.now();
        console.log(stopTime)
        console.log("Time it took to run the find the route: " + (stopTime - startTime))
        console.log("Time it took to run the find the route with perf: " + (stopTimePerf - startTimePerf))
        return;
        
    }
    
    await CommonFuncs.timeout(10);
    // Finding the adjacents of the current node that we are checking
    // We only search through the visited nodes to make it faster
    //var unionOfVisitedAndQueue = [...new Set([...queue, ...visitedNodes])];

    let adjacents = this.findAdjacents(nodes, checkNode.x, checkNode.y);
    
    // We set the first element of the adjacents list as the current best node, 
    // then we iterate through the rest and check if there's a better choice. 
    // Then we push the best node to the best nodes list.
    let currentBestDepth = Infinity;
    let currentBestNode = null;
    for (let i = 0 ; i < adjacents.length;i++){
        if (adjacents[i].depth < currentBestDepth && adjacents[i].visited){
            currentBestNode = adjacents[i];
            currentBestDepth = adjacents[i].depth;     
        }
    }
    

    // If the node we're currently checking isn't the Finish node, 
    //we set it's type to RouteNode, so it will have a different color.
    const checkNodeFromNodes = nodes[checkNode.y][checkNode.x];
    if (checkNodeFromNodes.type != PathPointType.Finish ) checkNodeFromNodes.type = PathPointType.RouteNode;
    
    // Lastly we update the screen for visualization, 
    // then we start the recursion the the current node
    setstate();
    //await timeout(1000);
    this.findShortestRoute(currentBestNode!, nodes, setstate);
}

// First part of the breadth-first search algorithm:
// Finding the Finish point and each visited node of 
// value based on their distance from the start node
 static async depthFirstSearch(nodes:NodeInterface[][], startPoint:{x:number,y:number}, setstate:Function, depthLimit?:number) {
    console.log("TImeout: " + solverTimeout);
    await CommonFuncs.timeout(solverTimeout);
    
    // Updating the current state
    setstate();
    let start_x = startPoint.x;
    let start_y = startPoint.y;
    const currentNode = nodes[start_y][start_x];
    
    // If the current node we're checking is the Finish node we exit the recursion 
    // and start the second part of this algorithm, finding the shortest route back to the Start node
    if (currentNode.type === PathPointType.Finish){
        console.log("Finish node found");
        await this.findShortestRoute(currentNode, nodes, setstate);
        return true;
    }
    
    // If the current node is tha Start node we push it to the queue so 
    // later on it won't be an issue shifting the array (removing the first element).
    if (currentNode.type === PathPointType.Start) 
    {   
        currentNode.visited = true;
        startTime = new Date().getTime();
        startTimePerf = performance.now();
        console.log("depth_first_search_running");
    };

    // We set the current node to visited and push it into an array
    currentNode.visited = true;
    if (currentNode.depth >= depthLimit!){
        return false;
    }

    // We find all the adjacent nodes of the current node and iterate through them
    // The ones that haven't been visited and aren't in the queue, we add to the queue
    const adjacents = this.findAdjacents(nodes, start_x, start_y);

    for (const adjacent of adjacents){
        if (adjacent.type != PathPointType.Wall && !adjacent.visited)
        {   
            adjacent.depth = currentNode.depth + 1;
            let found = await this.depthFirstSearch(nodes, {x:adjacent.x, y:adjacent.y},  setstate, depthLimit);
            if (found) return true;
        }

    }

    return false;
    
    
}


// Function for finding the neighbouring elements of the given node
// Input is the 2D array
 static findAdjacents(nodes:NodeInterface[][], base_x:number, base_y:number){
    let adjacents = [];
        
    for (let i = 0 ; i < nodes.length;i++){
        for (let j = 0; j < nodes[i].length; j++){
            const inColumnWithNode = Math.abs(nodes[i][j].y - base_y) === 1 && nodes[i][j].x == base_x;
            const inRowWithNode = Math.abs(nodes[i][j].x - base_x) === 1 && nodes[i][j].y == base_y;
            if (inRowWithNode || inColumnWithNode) adjacents.push(nodes[i][j]);         
        } 
    }
    return adjacents;
}
}

// Function for finding the neiughbouring elements of the given node
// Input is a 1D array
/*function findAdjacentsBacktrack(nodes:NodeInterface[],checkNode:NodeInterface){
    let base_x = checkNode.x;
    let base_y = checkNode.y;
    let adjacents = [];
    for (let i = 0; i < nodes.length; i++){
        if (Math.abs(nodes[i].x - base_x) === 1 && nodes[i].y == base_y) {
            if (nodes[i])
            adjacents.push(nodes[i]);
        } else if (Math.abs(nodes[i].y - base_y) === 1 && nodes[i].x == base_x){
            if (nodes[i])
            adjacents.push(nodes[i]);
        } 
    }
    return adjacents;
}*/