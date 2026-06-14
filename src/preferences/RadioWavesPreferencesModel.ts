/**
 * RadioWavesPreferencesModel.ts
 *
 * Sim-specific preferences (Preferences → Simulation) for Radio Waves. Each
 * preference Property takes its initial value from the corresponding query
 * parameter in radioWavesQueryParameters.
 */

import { BooleanProperty } from "scenerystack/axon";
import type { Tandem } from "scenerystack/tandem";
import RadioWavesNamespace from "../RadioWavesNamespace.js";
import radioWavesQueryParameters from "./radioWavesQueryParameters.js";

export class RadioWavesPreferencesModel {
  public readonly showPositionPlotsProperty: BooleanProperty;

  public constructor(tandem?: Tandem) {
    this.showPositionPlotsProperty = new BooleanProperty(
      radioWavesQueryParameters.showPositionPlots,
      tandem ? { tandem: tandem.createTandem("showPositionPlotsProperty") } : undefined,
    );
  }

  public reset(): void {
    this.showPositionPlotsProperty.reset();
  }
}

RadioWavesNamespace.register("RadioWavesPreferencesModel", RadioWavesPreferencesModel);
