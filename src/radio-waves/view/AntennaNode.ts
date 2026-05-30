/**
 * AntennaNode.ts
 *
 * Draws an antenna as a simple themeable rod between its two endpoints (vector-only port;
 * the original used a background sprite). Replaces the antenna art in `views/scene.js`.
 * A semi-transparent highlight line is drawn on top of the rod using antennaStrokeProperty,
 * giving the rod visual depth in both dark and projector themes.
 */

import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Line, Node } from "scenerystack/scenery";
import RadioWavesColors from "../../RadioWavesColors.js";
import type Antenna from "../model/Antenna.js";

const ROD_LINE_WIDTH = 5;
const HIGHLIGHT_LINE_WIDTH = 2;

export default class AntennaNode extends Node {
  public constructor(antenna: Antenna, modelViewTransform: ModelViewTransform2) {
    super();

    const p1 = modelViewTransform.modelToViewXY(antenna.end1.x, antenna.end1.y);
    const p2 = modelViewTransform.modelToViewXY(antenna.end2.x, antenna.end2.y);

    this.addChild(
      new Line(p1.x, p1.y, p2.x, p2.y, {
        stroke: RadioWavesColors.antennaFillProperty,
        lineWidth: ROD_LINE_WIDTH,
        lineCap: "round",
      }),
    );

    // Semi-transparent highlight on top of the rod body, matching the original's sprite depth.
    this.addChild(
      new Line(p1.x, p1.y, p2.x, p2.y, {
        stroke: RadioWavesColors.antennaStrokeProperty,
        lineWidth: HIGHLIGHT_LINE_WIDTH,
        lineCap: "round",
      }),
    );
  }
}
