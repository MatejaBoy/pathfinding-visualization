import { Component } from "react";
import { NodeInterface } from "../components/PathFindingVisualizer";

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
