/**
 * EmfSensingElectron.ts
 *
 * The receiving electron. Each fixed step it is first pinned back to its (constrained) rest
 * position with zero vertical velocity — exactly what the original achieved by inheriting a
 * held manual MovementStrategy — and then nudged by the field radiated from the source electron:
 *
 *   - field hasn't arrived yet  → stays at rest
 *   - source was oscillating    → mirrors the source's retarded position (scaled by 0.4)
 *   - otherwise (manual source) → a small Verlet step driven by the dynamic field
 *
 * Ported from `models/electron/emf-sensing.js`. The 0.4 / dt÷10 / ÷30 fudge factors are verbatim.
 */

import { Vector2, Vector2Property } from "scenerystack/dot";
import type Antenna from "./Antenna.js";
import type Electron from "./Electron.js";

export default class EmfSensingElectron {
  public readonly positionProperty: Vector2Property;
  public readonly startPosition: Vector2;

  private readonly positionConstraint: Antenna;
  private readonly sourceElectron: Electron;

  private readonly velocity = new Vector2(0, 0);
  private readonly location = new Vector2(0, 0); // reused field-sampling point
  private readonly aPrevious = new Vector2(0, 0); // previous acceleration (Verlet)

  public constructor(position: Vector2, positionConstraint: Antenna, sourceElectron: Electron) {
    this.startPosition = position.copy();
    this.positionConstraint = positionConstraint;
    this.sourceElectron = sourceElectron;
    this.location.set(position);

    const initial = position.copy();
    positionConstraint.constrainPosition(initial);
    this.positionProperty = new Vector2Property(initial);
  }

  public get position(): Vector2 {
    return this.positionProperty.value;
  }

  public setPosition(value: Vector2): void {
    const constrained = value.copy();
    this.positionConstraint.constrainPosition(constrained);
    this.positionProperty.value = constrained;
  }

  public update(dt: number): void {
    // Pin to the constrained rest position with zero vertical velocity (the original's inherited
    // manual-strategy reset). The EMF response below then displaces from here.
    this.setPosition(this.startPosition);
    this.velocity.setXY(0, 0);

    const pos = this.position;
    const v = this.velocity;
    const location = this.location;
    const source = this.sourceElectron;

    if (source.isFieldOff(pos.x)) {
      // Field hasn't reached this antenna: ease toward rest (a no-op here, since we just reset).
      v.setXY(0, (this.startPosition.y - pos.y) / 30);
      location.setXY(pos.x, pos.y + v.y * dt);
      return;
    }

    if (source.getMovementTypeAt(location) === "oscillate") {
      // For sinusoidal drive, mirror the source's retarded displacement (its 2nd derivative is
      // also a sinusoid, so position tracking suffices), scaled down.
      const dy = (source.getPositionAt(location) - this.startPosition.y) * 0.4;
      location.setXY(location.x, this.startPosition.y + dy);
    } else {
      // Otherwise treat the dynamic field as a force and take a small Verlet step.
      const a = source.getDynamicFieldAt(location);
      const dt2 = dt / 10; // "complete fudge factor"
      const newY = pos.y + v.y * dt2 + (a.y * dt2 * dt2) / 2;
      v.y += ((a.y + this.aPrevious.y) / 2) * dt2;
      location.setXY(pos.x + v.x * dt, newY);
      this.aPrevious.set(a);
    }

    this.setPosition(location);
  }

  public reset(): void {
    this.velocity.setXY(0, 0);
    this.aPrevious.setXY(0, 0);
    this.location.set(this.startPosition);
    this.setPosition(this.startPosition);
  }
}
