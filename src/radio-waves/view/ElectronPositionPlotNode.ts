/**
 * ElectronPositionPlotNode.ts
 *
 * A small oscilloscope panel that scrolls a trace of an electron's vertical position over time.
 * The newest sample is at the left edge; samples scroll right. Ported from
 * `views/electron-position-plot.js`. The trace itself is an inner CanvasNode repainted each
 * frame by the screen view; the panel chrome (background, title, axis label) is Scenery.
 */

import type { ReadOnlyProperty } from "scenerystack";
import { Bounds2, type Vector2 } from "scenerystack/dot";
import { CanvasNode, Node, Rectangle, Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import RadioWavesColors from "../../RadioWavesColors.js";

const WIDTH = 260;
const HEIGHT = 160;
const PLOT_X = 15; // left/right inset = top area reserved for the title
const PLOT_Y = 30;
const PLOT_BOTTOM_MARGIN = 30; // space below the plot for the axis label
const PLOT_WIDTH = WIDTH - 2 * PLOT_X;
const PLOT_HEIGHT = HEIGHT - (PLOT_Y + PLOT_BOTTOM_MARGIN);
const TICK_SPACE = 20; // px between scrolling vertical gridlines

const PANEL_CORNER_RADIUS = 6;
const TITLE_FONT = new PhetFont(13);
const AXIS_FONT = new PhetFont(11);
const TITLE_TOP = 6;
const AXIS_LABEL_TOP_GAP = 6; // gap below the plot to the axis label
const TEXT_MAX_WIDTH = WIDTH - 16;
const GRID_LINE_WIDTH = 1;
const TRACE_LINE_WIDTH = 1.5;

export default class ElectronPositionPlotNode extends Node {
  private readonly trace: PlotTraceNode;

  public constructor(
    positionProperty: ReadOnlyProperty<Vector2>,
    restY: number,
    halfRange: number,
    title: ReadOnlyProperty<string>,
    timeLabel: ReadOnlyProperty<string>,
  ) {
    super();

    const background = new Rectangle(0, 0, WIDTH, HEIGHT, {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: RadioWavesColors.panelFillProperty,
      stroke: RadioWavesColors.panelStrokeProperty,
    });

    const titleText = new Text(title, {
      font: TITLE_FONT,
      fill: RadioWavesColors.foregroundColorProperty,
      maxWidth: TEXT_MAX_WIDTH,
      centerX: WIDTH / 2,
      top: TITLE_TOP,
    });

    const plotBackground = new Rectangle(PLOT_X, PLOT_Y, PLOT_WIDTH, PLOT_HEIGHT, {
      fill: RadioWavesColors.plotBackgroundProperty,
      stroke: RadioWavesColors.plotGridProperty,
    });

    this.trace = new PlotTraceNode(positionProperty, restY, halfRange);
    this.trace.x = PLOT_X;
    this.trace.y = PLOT_Y;

    const axisLabel = new Text(timeLabel, {
      font: AXIS_FONT,
      fill: RadioWavesColors.foregroundColorProperty,
      maxWidth: TEXT_MAX_WIDTH,
      centerX: WIDTH / 2,
      top: PLOT_Y + PLOT_HEIGHT + AXIS_LABEL_TOP_GAP,
    });

    this.children = [background, titleText, plotBackground, this.trace, axisLabel];
  }

  /** Push a new sample and repaint (called each frame by the screen view while plots are shown). */
  public update(): void {
    this.trace.update();
  }

  /** Clear the trace (on Reset All). */
  public reset(): void {
    this.trace.reset();
  }
}

class PlotTraceNode extends CanvasNode {
  private readonly positionProperty: ReadOnlyProperty<Vector2>;
  private readonly restY: number;
  private readonly yScale: number;
  private readonly data: number[] = [];
  private tickX = 0;

  public constructor(positionProperty: ReadOnlyProperty<Vector2>, restY: number, halfRange: number) {
    super({ canvasBounds: new Bounds2(0, 0, PLOT_WIDTH, PLOT_HEIGHT) });
    this.positionProperty = positionProperty;
    this.restY = restY;
    // Map a displacement of ±halfRange to ±half the plot height.
    this.yScale = halfRange > 0 ? PLOT_HEIGHT / 2 / halfRange : 0;

    RadioWavesColors.plotLineProperty.link(() => this.invalidatePaint());
    RadioWavesColors.plotGridProperty.link(() => this.invalidatePaint());
  }

  public update(): void {
    this.tickX = (this.tickX + 1) % TICK_SPACE;
    this.data.unshift(this.positionProperty.value.y - this.restY);
    if (this.data.length > PLOT_WIDTH) {
      this.data.length = PLOT_WIDTH;
    }
    this.invalidatePaint();
  }

  public reset(): void {
    this.data.length = 0;
    this.tickX = 0;
    this.invalidatePaint();
  }

  public override paintCanvas(context: CanvasRenderingContext2D): void {
    // Gridlines.
    context.strokeStyle = RadioWavesColors.plotGridProperty.value.toCSS();
    context.lineWidth = GRID_LINE_WIDTH;
    context.beginPath();
    context.moveTo(0, PLOT_HEIGHT / 2);
    context.lineTo(PLOT_WIDTH, PLOT_HEIGHT / 2);
    for (let x = 0; x < PLOT_WIDTH; x++) {
      if (x % TICK_SPACE === this.tickX) {
        context.moveTo(x, 0);
        context.lineTo(x, PLOT_HEIGHT);
      }
    }
    context.stroke();

    // Trace (newest sample at the left edge).
    context.strokeStyle = RadioWavesColors.plotLineProperty.value.toCSS();
    context.lineWidth = TRACE_LINE_WIDTH;
    context.beginPath();
    const mid = PLOT_HEIGHT / 2;
    for (let i = 1; i < this.data.length; i++) {
      const y0 = mid + (this.data[i - 1] ?? 0) * this.yScale;
      const y1 = mid + (this.data[i] ?? 0) * this.yScale;
      context.moveTo(i - 1, y0);
      context.lineTo(i, y1);
    }
    context.stroke();
  }
}
