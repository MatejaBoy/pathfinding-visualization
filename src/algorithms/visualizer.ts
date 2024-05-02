import { PathPointType, SearchResults } from "../components/PathFindingVisualizer";
import CommonFuncs from "./common-func";

export default class PFVisualizer {
  maxTimeout = 1000;
  minTimeout = 10;
  solverTimeout: number | null = null;
  shouldVis = false;

  stopVisualize() {
    this.shouldVis = false;
  }

  setSolverSpeed(percent: number) {
    this.solverTimeout = CommonFuncs.mapFromRangeToRange(
      percent,
      { min: 5, max: 100 },
      { min: this.maxTimeout, max: this.minTimeout }
    );
  }

  async visualizeResults(
    results: SearchResults,
    setstate: Function,
    defaultspeed: number,
    needtimeout: boolean,
    clear?: Function
  ) {
    this.shouldVis = true;
    if (this.solverTimeout === null) this.setSolverSpeed(defaultspeed);

    // Visualize visited nodes
    for (const node of results.visitedNodes) {
      if (node.type === PathPointType.SpacerNode && clear !== undefined) clear();
      needtimeout ? await CommonFuncs.timeout(this.solverTimeout!) : null;
      if (!this.shouldVis) return false;
      node.visited = true;
      node.toAnimate = true;
      setstate();
    }

    if (!this.shouldVis) return false;
    results.routeNodes.reverse();

    // Visualize route nodes
    for (const node of results.routeNodes) {
      needtimeout ? await CommonFuncs.timeout(this.solverTimeout!) : null;
      if (!this.shouldVis) return false;
      node.isRouteNode = true;
      node.toAnimate = true;
      setstate();
    }

    return true;
  }
}
