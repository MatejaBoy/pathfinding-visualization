import { Algorithms } from "../components/PathFindingVisualizer";

export default class Texts {


    static navbarTitle = "Pathfinding Visualizer"

    static astarDesc = 
    "The A* algorithm is a pathfinding technique that efficiently finds the shortest path between two points in a graph by combining the benefits of both Dijkstra's algorithm and greedy best-first search. It uses heuristics to determine to distance from the given node to the finish node."
    static astarTitle = "A* Search"

    static dijkstraDesc = 
    "Dijkstra's algorithm is a graph search algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph by iteratively selecting the vertex with the smallest tentative distance.";
    static dijkstraTitle = "Dijkstra Search"
    
    static dfsDesc = "DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking, typically implemented using a stack data structure.";
    static dfsTitle = "Depth-First Search"
    
    static iddfsDesc = "IDDFS is a graph traversal algorithm that combines the depth-first search approach with iterative deepening by gradually increasing the depth limit until the goal is found, ensuring completeness while maintaining the space efficiency of DFS."
    static iddfsTitle = "Iterative Deepening Depth-First Search"
    static idCheckBoxText = "Iterative Deepening";

    static bfsDesc = "BFS is a graph traversal algorithm that explores all the neighbors of a vertex before moving on to their neighbors, typically implemented using a queue data structure.";
    static bfsTitle = "Breadth First Search";


    static howtouse = "How to use:";
    static step1 = "You can move the Start (green) and Finish (red) point by dragging them";
    static step2 = "Click on a node or drag the mouse over it while holding the left mouse button to set it to a wall";
    static step3 = "Click on a route between two nodes once or multiple times to increase its weight";
    static step4 = "Press the Let's visualize button start visualizing";
    static step5 = "Use the 'Speed' slider to set the solving speed";
    static hint1 = "Try relocating the Start and Finish nodes while visualization is turned on"


    static returnDesc(alg: Algorithms):string {
        switch (alg) {
            case Algorithms.BFS:
              return this.bfsDesc;
            case Algorithms.DFS:
              return this.dfsDesc;
            case Algorithms.IDDFS:
              return this.iddfsDesc;                  
            case Algorithms.WD:
              return this.dijkstraDesc;
            case Algorithms.AS:
                return this.astarDesc
          }
    }

    static returnTitle(alg: Algorithms):string {
        switch (alg) {
            case Algorithms.BFS:
              return this.bfsTitle;
            case Algorithms.DFS:
              return this.dfsTitle;
            case Algorithms.IDDFS:
              return this.iddfsTitle;                  
            case Algorithms.WD:
              return this.dijkstraTitle;
            case Algorithms.AS:
                return this.astarTitle
          }
    }
}