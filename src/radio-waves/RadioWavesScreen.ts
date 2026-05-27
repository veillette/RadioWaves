import { Screen, type ScreenOptions } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import { RadioWavesModel } from "./model/RadioWavesModel.js";
import { RadioWavesScreenView } from "./view/RadioWavesScreenView.js";

type RadioWavesScreenOptions = ScreenOptions & { tandem: Tandem };

export class RadioWavesScreen extends Screen<RadioWavesModel, RadioWavesScreenView> {
  public constructor(options: RadioWavesScreenOptions) {
    super(
      () => new RadioWavesModel(),
      (model) => new RadioWavesScreenView(model, { tandem: options.tandem.createTandem("view") }),
      options,
    );
  }
}
