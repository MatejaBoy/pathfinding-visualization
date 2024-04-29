import { Component } from "react";
import { SearchResults } from "../components/PathFindingVisualizer";

export interface Point {
  x: number;
  y: number;
}

export default class CommonFuncs extends Component<{}, {}> {
  static timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  static mapFromRangeToRange(
    value: number,
    originalRange: { min: number; max: number },
    newRange: { min: number; max: number }
  ) {
    let percentige = (value - originalRange.min) / (originalRange.max - originalRange.min);
    let scaledValue = percentige * (newRange.max - newRange.min) + newRange.min;
    return scaledValue;
  }

  static getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  static async visualizeResults(results: SearchResults, setstate: Function) {
    // Visualize visited nodes
    for (const node of results.visitedNodes) {
      //await CommonFuncs.timeout(25);
      node.toAnimate = true;
      //setstate();
    }

    results.routeNodes.reverse();
    // Visualize route nodes
    for (const node of results.routeNodes) {
      //await CommonFuncs.timeout(25);
      node.isTestOnProp = true;
      node.toAnimate = true;
      //setstate();
    }

    setstate();
  }
}
