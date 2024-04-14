import { NodeInterface, PathPointType } from "../components/PathFindingVisualizer";

export default class CommonFuncs {
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
