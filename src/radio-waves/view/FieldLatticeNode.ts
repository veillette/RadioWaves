/**
 * FieldLatticeNode.ts
 *
 * Visualizes the transmitting electron's field. A CanvasNode painted every frame (matching the
 * original's immediate-mode PIXI.Graphics), it supports the four display types, the force/field
 * sense, and the radiated/static choice from the model:
 *
 *   - "curve"            : a single line tracing the field strength along the x-axis
 *   - "curveWithVectors" : that curve plus vertical field-strength arrows at lattice points
 *   - "fullField"        : a 2-D grid of field arrows
 *   - "none"             : nothing
 *
 * Ported from `views/field-lattice.js`.
 */

import type { Bounds2 } from "scenerystack/dot";
import { Vector2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { CanvasNode } from "scenerystack/scenery";
import RadioWavesColors from "../../RadioWavesColors.js";
import type { RadioWavesModel } from "../model/RadioWavesModel.js";

const SPACING = 50; // model-unit lattice spacing
const FIRST_ARROW_OFFSET = 25; // skip this close to the antenna
const GRID_OFFSET_X = 32; // full-field grid left inset (from the source)
const MIN_FULL_FIELD_LENGTH = 3; // below this (model units) a full-field arrow is omitted
const CURVE_STEP = 10; // x sampling step (model units) for the curve
const ORIGIN_SENTINEL_OFFSET = 0.001; // nudge off the exact origin to fix the curve start side

// Arrow / line styling (view pixels).
const CURVE_LINE_WIDTH = 1;
const AXIS_ARROW_LINE_WIDTH = 3;
const AXIS_ARROW_HEAD_WIDTH = 10;
const AXIS_ARROW_HEAD_LENGTH = 10;
const FULL_FIELD_LINE_WIDTH = 1;
const FULL_FIELD_ARROW_HEAD_WIDTH = 6;
const FULL_FIELD_ARROW_HEAD_LENGTH = 8;
const MIN_ARROW_LENGTH = 1e-6; // below this an arrow is skipped (avoids divide-by-zero)

export default class FieldLatticeNode extends CanvasNode {
  private readonly model: RadioWavesModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly minXModel: number;
  private readonly maxXModel: number;

  // Precomputed x-axis lattice x-values (index 0 is a near-origin sentinel; the curve starts at 1).
  private readonly leftXs: number[] = [];
  private readonly rightXs: number[] = [];
  // Precomputed full-field grid points (model coordinates).
  private readonly gridPoints: Vector2[] = [];

  public constructor(model: RadioWavesModel, modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2) {
    super({ canvasBounds });
    this.model = model;
    this.modelViewTransform = modelViewTransform;

    const originX = model.origin.x;
    this.minXModel = modelViewTransform.viewToModelX(canvasBounds.minX);
    this.maxXModel = modelViewTransform.viewToModelX(canvasBounds.maxX);

    const lo = this.minXModel - SPACING;
    const hi = this.maxXModel + SPACING;
    this.leftXs.push(originX - ORIGIN_SENTINEL_OFFSET);
    for (let x = originX - FIRST_ARROW_OFFSET; x >= lo; x -= SPACING) {
      this.leftXs.push(x);
    }
    this.rightXs.push(originX + ORIGIN_SENTINEL_OFFSET);
    for (let x = originX + FIRST_ARROW_OFFSET; x < hi; x += SPACING) {
      this.rightXs.push(x);
    }

    // A clean 2-D grid for the full-field view. (The original swept a single index, which sheared
    // the rows; a proper grid is the clear intent of a "Full Field" view and matches it visually.)
    const numX = 1 + Math.floor((model.bounds.width - 1) / SPACING);
    const numY = 1 + Math.floor((model.bounds.height - 1) / SPACING);
    for (let row = 0; row < numY; row++) {
      for (let col = 0; col < numX; col++) {
        this.gridPoints.push(new Vector2(GRID_OFFSET_X + col * SPACING, row * SPACING));
      }
    }

    // Repaint on theme changes (per-frame repaints during play are driven by the screen view).
    RadioWavesColors.forceArrowProperty.link(() => this.invalidatePaint());
    RadioWavesColors.fieldArrowProperty.link(() => this.invalidatePaint());
    model.fieldDisplayTypeProperty.link(() => this.invalidatePaint());
    model.fieldSenseProperty.link(() => this.invalidatePaint());
    model.fieldDisplayedProperty.link(() => this.invalidatePaint());
  }

  /** Called by the screen view every animation frame so the field tracks the moving electron. */
  public update(): void {
    this.invalidatePaint();
  }

  public override paintCanvas(context: CanvasRenderingContext2D): void {
    const type = this.model.fieldDisplayTypeProperty.value;
    if (type === "none") {
      return;
    }
    if (type === "fullField") {
      this.paintFullField(context);
    } else {
      this.paintCurve(context, type === "curveWithVectors");
    }
  }

  // ── Curve (+ optional vertical arrows) ──────────────────────────────────────
  private paintCurve(context: CanvasRenderingContext2D, withVectors: boolean): void {
    const radiated = this.model.fieldDisplayedProperty.value === "radiated";
    const curveColor = (radiated ? RadioWavesColors.forceArrowProperty : RadioWavesColors.fieldArrowProperty).value;
    context.strokeStyle = curveColor.toCSS();
    context.lineWidth = CURVE_LINE_WIDTH;

    this.drawCurveSide(context, this.leftXs);
    this.drawCurveSide(context, this.rightXs);

    if (withVectors) {
      const sense = this.model.fieldSenseProperty.value === "forceOnElectron" ? 1 : -1;
      const arrowColor = (sense === 1 ? RadioWavesColors.forceArrowProperty : RadioWavesColors.fieldArrowProperty)
        .value;
      context.strokeStyle = arrowColor.toCSS();
      context.fillStyle = arrowColor.toCSS();
      context.lineWidth = AXIS_ARROW_LINE_WIDTH;
      this.drawAxisArrows(context, this.leftXs, sense);
      this.drawAxisArrows(context, this.rightXs, sense);
    }
  }

  private drawCurveSide(context: CanvasRenderingContext2D, xs: number[]): void {
    const mvt = this.modelViewTransform;
    const originX = this.model.origin.x;
    const originY = this.model.origin.y;
    const start = xs[1];
    if (start === undefined) {
      return;
    }
    const xSign = Math.sign(start - originX) || 1;

    context.beginPath();
    let first = true;
    for (let x = start; xSign > 0 ? x <= this.maxXModel : x >= this.minXModel; x += CURVE_STEP * xSign) {
      // The field is symmetric about the antenna; sample its mirror for x left of (and below) zero.
      const sampleX = x < 0 ? originX + (originX - x) : Math.abs(x);
      const field = this.model.getDynamicFieldAt(new Vector2(sampleX, originY));
      const yCurr = field.magnitude * Math.sign(field.y);
      const vx = mvt.modelToViewX(x);
      const vy = mvt.modelToViewY(originY + yCurr);
      if (first) {
        context.moveTo(vx, vy);
        first = false;
      } else {
        context.lineTo(vx, vy);
      }
    }
    context.stroke();
  }

  private drawAxisArrows(context: CanvasRenderingContext2D, xs: number[], sense: number): void {
    const mvt = this.modelViewTransform;
    const originY = this.model.origin.y;
    const radiated = this.model.fieldDisplayedProperty.value === "radiated";
    // We skip index 0 (sentinel) and index 1 (too close to the antenna), matching the original.
    for (let i = 2; i < xs.length; i++) {
      const x = xs[i];
      if (x === undefined) {
        continue;
      }
      const location = new Vector2(x, originY);
      const field = radiated ? this.model.getDynamicFieldAt(location) : this.model.getStaticFieldAt(location);
      const magnitude = field.magnitude;
      const arrowDir = Math.sign(field.y) * sense;
      const tipY = originY + magnitude * arrowDir;
      FieldLatticeNode.drawArrow(
        context,
        mvt.modelToViewX(x),
        mvt.modelToViewY(originY),
        mvt.modelToViewX(x),
        mvt.modelToViewY(tipY),
        AXIS_ARROW_HEAD_WIDTH,
        AXIS_ARROW_HEAD_LENGTH,
      );
    }
  }

  // ── Full field (2-D arrow grid) ─────────────────────────────────────────────
  private paintFullField(context: CanvasRenderingContext2D): void {
    const mvt = this.modelViewTransform;
    const sense = this.model.fieldSenseProperty.value === "forceOnElectron" ? 1 : -1;
    const radiated = this.model.fieldDisplayedProperty.value === "radiated";
    const color = (sense === 1 ? RadioWavesColors.forceArrowProperty : RadioWavesColors.fieldArrowProperty).value;
    context.strokeStyle = color.toCSS();
    context.fillStyle = color.toCSS();
    context.lineWidth = FULL_FIELD_LINE_WIDTH;

    for (const point of this.gridPoints) {
      const field = radiated ? this.model.getDynamicFieldAt(point) : this.model.getStaticFieldAt(point);
      const fx = field.x * sense;
      const fy = field.y * sense;
      if (Math.hypot(fx, fy) <= MIN_FULL_FIELD_LENGTH) {
        continue;
      }
      const ox = point.x - fx / 2;
      const oy = point.y - fy / 2;
      FieldLatticeNode.drawArrow(
        context,
        mvt.modelToViewX(ox),
        mvt.modelToViewY(oy),
        mvt.modelToViewX(ox + fx),
        mvt.modelToViewY(oy + fy),
        FULL_FIELD_ARROW_HEAD_WIDTH,
        FULL_FIELD_ARROW_HEAD_LENGTH,
      );
    }
  }

  // Filled-head arrow with a stroked shaft (shared with the EFD port's helper).
  private static drawArrow(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    headWidth: number,
    headLength: number,
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (length < MIN_ARROW_LENGTH) {
      return;
    }
    const ux = dx / length;
    const uy = dy / length;
    const effectiveHead = Math.min(headLength, length);
    const baseX = x2 - ux * effectiveHead;
    const baseY = y2 - uy * effectiveHead;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(baseX, baseY);
    context.stroke();

    const px = -uy;
    const py = ux;
    const half = headWidth / 2;
    context.beginPath();
    context.moveTo(x2, y2);
    context.lineTo(baseX + px * half, baseY + py * half);
    context.lineTo(baseX - px * half, baseY - py * half);
    context.closePath();
    context.fill();
  }
}
