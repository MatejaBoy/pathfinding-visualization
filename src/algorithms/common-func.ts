import { Component } from "react";

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
}
