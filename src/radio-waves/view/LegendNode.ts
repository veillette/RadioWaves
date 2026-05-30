/**
 * LegendNode.ts
 *
 * A small legend panel that identifies the electron icon shown in the play area.
 * Ported from the original's legend overlay. Strings are sourced from StringManager
 * so the label is localized with the rest of the UI.
 */

import { Circle, HBox, Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Panel } from "scenerystack/sun";
import { StringManager } from "../../i18n/StringManager.js";
import RadioWavesColors from "../../RadioWavesColors.js";

const TITLE_FONT = new PhetFont({ size: 14, weight: "bold" });
const LABEL_FONT = new PhetFont(13);
const ELECTRON_RADIUS = 9;
const ELECTRON_STROKE_WIDTH = 1.5;
const PANEL_CORNER_RADIUS = 6;
const PANEL_X_MARGIN = 12;
const PANEL_Y_MARGIN = 10;
const ICON_LABEL_SPACING = 8;
const TITLE_ITEM_SPACING = 8;

export default class LegendNode extends Panel {
  public constructor() {
    const strings = StringManager.getInstance().getLegendStrings();

    const title = new Text(strings.titleStringProperty, {
      font: TITLE_FONT,
      fill: RadioWavesColors.foregroundColorProperty,
    });

    const electronIcon = new Circle(ELECTRON_RADIUS, {
      fill: RadioWavesColors.electronFillProperty,
      stroke: RadioWavesColors.electronStrokeProperty,
      lineWidth: ELECTRON_STROKE_WIDTH,
    });

    const electronLabel = new Text(strings.electronStringProperty, {
      font: LABEL_FONT,
      fill: RadioWavesColors.foregroundColorProperty,
    });

    const electronRow = new HBox({
      spacing: ICON_LABEL_SPACING,
      align: "center",
      children: [electronIcon, electronLabel],
    });

    const content = new VBox({
      align: "left",
      spacing: TITLE_ITEM_SPACING,
      children: [title, electronRow],
    });

    super(content, {
      fill: RadioWavesColors.panelFillProperty,
      stroke: RadioWavesColors.panelStrokeProperty,
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
    });
  }
}
