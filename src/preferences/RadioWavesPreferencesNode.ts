/**
 * RadioWavesPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Controls are bound to
 * RadioWavesPreferencesModel Properties (initial values from query parameters).
 */

import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Checkbox } from "scenerystack/sun";
import type { Tandem } from "scenerystack/tandem";
import { StringManager } from "../i18n/StringManager.js";
import RadioWavesNamespace from "../RadioWavesNamespace.js";
import type { RadioWavesPreferencesModel } from "./RadioWavesPreferencesModel.js";

export class RadioWavesPreferencesNode extends VBox {
  public constructor(preferencesModel: RadioWavesPreferencesModel, tandem?: Tandem) {
    const prefStrings = StringManager.getInstance().getPreferences();

    const header = new Text(prefStrings.titleStringProperty, {
      font: new PhetFont({ size: 18, weight: "bold" }),
    });

    const showPositionPlotsCheckbox = new Checkbox(
      preferencesModel.showPositionPlotsProperty,
      new Text(prefStrings.showPositionPlotsStringProperty, { font: new PhetFont(14) }),
      {
        spacing: 8,
        ...(tandem && { tandem: tandem.createTandem("showPositionPlotsCheckbox") }),
      },
    );

    super({
      align: "left",
      spacing: 12,
      children: [header, showPositionPlotsCheckbox],
    });
  }
}

RadioWavesNamespace.register("RadioWavesPreferencesNode", RadioWavesPreferencesNode);
