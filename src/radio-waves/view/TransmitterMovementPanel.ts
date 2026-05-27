/**
 * TransmitterMovementPanel.ts
 *
 * Chooses how the transmitting electron moves — dragged by hand (Manual) or driven by the
 * oscillator (Oscillate) — and, when oscillating, sets the frequency and amplitude. The two
 * sliders are disabled in manual mode. Replaces the "Transmitter Movement" panel from sim.html.
 */

import type { ReadOnlyProperty } from "scenerystack";
import { Text, VBox } from "scenerystack/scenery";
import { NumberControl, PhetFont } from "scenerystack/scenery-phet";
import { AquaRadioButtonGroup, Panel } from "scenerystack/sun";
import { StringManager } from "../../i18n/StringManager.js";
import RadioWavesColors from "../../RadioWavesColors.js";
import type { MovementMode } from "../model/MovementStrategy.js";
import Constants from "../model/RadioWavesConstants.js";
import type { RadioWavesModel } from "../model/RadioWavesModel.js";

const TITLE_FONT = new PhetFont({ size: 15, weight: "bold" });
const LABEL_FONT = new PhetFont(14);
const CONTROL_FONT = new PhetFont(13);

export default class TransmitterMovementPanel extends Panel {
  public constructor(model: RadioWavesModel) {
    const strings = StringManager.getInstance().getTransmitterMovementStrings();

    const header = new Text(strings.titleStringProperty, {
      font: TITLE_FONT,
      fill: RadioWavesColors.foregroundColorProperty,
    });

    const label = (text: ReadOnlyProperty<string>): Text =>
      new Text(text, { font: LABEL_FONT, fill: RadioWavesColors.foregroundColorProperty });

    const movementRadioGroup = new AquaRadioButtonGroup<MovementMode>(
      model.movementModeProperty,
      [
        { value: "manual", createNode: () => label(strings.manualStringProperty) },
        { value: "oscillate", createNode: () => label(strings.oscillateStringProperty) },
      ],
      { spacing: 6 },
    );

    const numberControlOptions = {
      titleNodeOptions: { font: CONTROL_FONT, fill: RadioWavesColors.foregroundColorProperty },
      numberDisplayOptions: { textOptions: { font: CONTROL_FONT }, decimalPlaces: 0 },
      sliderOptions: { constrainValue: (value: number) => Math.round(value) },
      delta: 1,
    };

    const frequencyControl = new NumberControl(
      strings.frequencyStringProperty,
      model.frequencyProperty,
      Constants.FREQUENCY_RANGE,
      numberControlOptions,
    );
    const amplitudeControl = new NumberControl(
      strings.amplitudeStringProperty,
      model.amplitudeProperty,
      Constants.AMPLITUDE_RANGE,
      numberControlOptions,
    );

    const content = new VBox({
      align: "left",
      spacing: 10,
      children: [header, movementRadioGroup, frequencyControl, amplitudeControl],
    });

    super(content, {
      fill: RadioWavesColors.panelFillProperty,
      stroke: RadioWavesColors.panelStrokeProperty,
      cornerRadius: 6,
      xMargin: 12,
      yMargin: 10,
    });

    // The oscillator controls are only meaningful while oscillating.
    model.movementModeProperty.link((mode) => {
      const oscillating = mode === "oscillate";
      frequencyControl.enabled = oscillating;
      amplitudeControl.enabled = oscillating;
    });
  }
}
