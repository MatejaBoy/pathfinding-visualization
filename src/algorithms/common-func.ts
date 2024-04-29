import { Component } from "react";
import { SearchResults } from "../components/PathFindingVisualizer";

export interface Point {
  x: number;
  y: number;
}

export interface Range {
  min: number;
  max: number;
}

export default class CommonFuncs extends Component<{}, {}> {
  static timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  static mapFromRangeToRange(value: number, originalRange: Range, newRange: Range) {
    let percentige = (value - originalRange.min) / (originalRange.max - originalRange.min);
    let scaledValue = percentige * (newRange.max - newRange.min) + newRange.min;
    return scaledValue;
  }

  static getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
