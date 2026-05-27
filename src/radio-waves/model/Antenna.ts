/**
 * Antenna.ts
 *
 * A straight antenna segment between two endpoints. Its only job is `constrainPosition`,
 * which snaps a point onto the segment (used to keep an electron on its antenna). Ported
 * verbatim from `models/antenna.js`. The sim only ever uses vertical antennas, but the
 * general line math is kept so the behavior matches the original exactly.
 */

import type { Vector2 } from "scenerystack/dot";

export default class Antenna {
  public readonly end1: Vector2;
  public readonly end2: Vector2;
  public readonly maxX: number;
  public readonly maxY: number;
  public readonly minX: number;
  public readonly minY: number;

  // Slope (m) and intercept (b) of the line through the endpoints; m = +Infinity when vertical.
  private readonly m: number;
  private readonly b: number;

  public constructor(end1: Vector2, end2: Vector2) {
    this.end1 = end1.copy();
    this.end2 = end2.copy();

    this.maxX = Math.max(end1.x, end2.x);
    this.maxY = Math.max(end1.y, end2.y);
    this.minX = Math.min(end1.x, end2.x);
    this.minY = Math.min(end1.y, end2.y);

    if (end1.x === end2.x) {
      this.m = Number.POSITIVE_INFINITY;
      this.b = Number.NaN;
    } else {
      this.m = (end1.y - end2.y) / (end1.x - end2.x);
      this.b = end1.y - end1.x * this.m;
    }
  }

  /** Snaps `pos` (mutated in place) onto the antenna segment and returns it. */
  public constrainPosition(pos: Vector2): Vector2 {
    if (pos.x > this.maxX) {
      pos.setXY(this.maxX, this.getYForX(this.maxX, pos.y));
    }
    if (pos.x < this.minX) {
      pos.setXY(this.minX, this.getYForX(this.minX, pos.y));
    }
    if (pos.y > this.maxY) {
      pos.setXY(this.getXForY(this.maxY, pos.x), this.maxY);
    }
    if (pos.y < this.minY) {
      pos.setXY(this.getXForY(this.minY, pos.x), this.minY);
    }
    pos.setXY(pos.x, this.getYForX(pos.x, pos.y));
    return pos;
  }

  private getYForX(x: number, y: number): number {
    return this.m === Number.POSITIVE_INFINITY ? y : this.m * x + this.b;
  }

  private getXForY(y: number, x: number): number {
    return this.m === 0 || this.m === Number.POSITIVE_INFINITY ? x : (y - this.b) / this.m;
  }
}
