/**
 * FieldControlPanel.ts
 *
 * The right-hand field options: how the field is drawn (Field Display), what the arrows mean
 * (Field Sense), and which field is shown (Field Displayed). Choosing the Static field forces
 * the Full Field display and disables the other display choices, exactly as the original did.
 * Replaces the "Field Display Type / Field Sense / Field Displayed" panel from sim.html.
 */

import type { ReadOnlyProperty } from "scenerystack";
import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { AquaRadioButtonGroup, Panel } from "scenerystack/sun";
import { StringManager } from "../../i18n/StringManager.js";
import RadioWavesColors from "../../RadioWavesColors.js";
import type { FieldDisplayed, FieldDisplayType, FieldSense, RadioWavesModel } from "../model/RadioWavesModel.js";

const HEADER_FONT = new PhetFont({ size: 14, weight: "bold" });
const LABEL_FONT = new PhetFont(13);

const RADIO_SPACING = 6;
const CONTENT_SPACING = 10;
const PANEL_CORNER_RADIUS = 6;
const PANEL_X_MARGIN = 12;
const PANEL_Y_MARGIN = 10;

export default class FieldControlPanel extends Panel {
  public constructor(model: RadioWavesModel) {
    const stringManager = StringManager.getInstance();
    const displayStrings = stringManager.getFieldDisplayTypeStrings();
    const senseStrings = stringManager.getFieldSenseStrings();
    const displayedStrings = stringManager.getFieldDisplayedStrings();
    const a11y = stringManager.getA11yStrings();

    const header = (text: ReadOnlyProperty<string>): Text =>
      new Text(text, { font: HEADER_FONT, fill: RadioWavesColors.foregroundColorProperty });
    const label = (text: ReadOnlyProperty<string>): Text =>
      new Text(text, { font: LABEL_FONT, fill: RadioWavesColors.foregroundColorProperty });

    const displayTypeGroup = new AquaRadioButtonGroup<FieldDisplayType>(
      model.fieldDisplayTypeProperty,
      [
        { value: "curveWithVectors", createNode: () => label(displayStrings.curveWithVectorsStringProperty) },
        { value: "curve", createNode: () => label(displayStrings.curveStringProperty) },
        { value: "fullField", createNode: () => label(displayStrings.fullFieldStringProperty) },
        { value: "none", createNode: () => label(displayStrings.noneStringProperty) },
      ],
      { spacing: RADIO_SPACING, accessibleName: a11y.controls.fieldDisplayStringProperty },
    );

    const senseGroup = new AquaRadioButtonGroup<FieldSense>(
      model.fieldSenseProperty,
      [
        { value: "forceOnElectron", createNode: () => label(senseStrings.forceOnElectronStringProperty) },
        { value: "electricField", createNode: () => label(senseStrings.electricFieldStringProperty) },
      ],
      { spacing: RADIO_SPACING, accessibleName: a11y.controls.fieldSenseStringProperty },
    );

    const displayedGroup = new AquaRadioButtonGroup<FieldDisplayed>(
      model.fieldDisplayedProperty,
      [
        { value: "radiated", createNode: () => label(displayedStrings.radiatedStringProperty) },
        { value: "static", createNode: () => label(displayedStrings.staticStringProperty) },
      ],
      { spacing: RADIO_SPACING, accessibleName: a11y.controls.fieldDisplayedStringProperty },
    );

    const content = new VBox({
      align: "left",
      spacing: CONTENT_SPACING,
      children: [
        header(displayStrings.titleStringProperty),
        displayTypeGroup,
        header(senseStrings.titleStringProperty),
        senseGroup,
        header(displayedStrings.titleStringProperty),
        displayedGroup,
      ],
    });

    super(content, {
      fill: RadioWavesColors.panelFillProperty,
      stroke: RadioWavesColors.panelStrokeProperty,
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
    });

    // The static field has no curve/vector representation, so it pins the Full Field display.
    model.fieldDisplayedProperty.link((displayed) => {
      if (displayed === "static") {
        model.fieldDisplayTypeProperty.value = "fullField";
        displayTypeGroup.enabled = false;
      } else {
        displayTypeGroup.enabled = true;
      }
    });
  }
}
