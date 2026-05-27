/**
 * main.ts
 *
 * Entry point for the Radio Waves & Electromagnetic Fields application. Initializes the
 * simulation, creates the screen, and starts the main event loop.
 */

// NOTE: brand.js needs to be the first import. SceneryStack sims require a specific load order:
// init.ts => assert.ts => splash.ts => brand.ts => everything else (here).
import "./brand.js";

import { onReadyToLaunch, PreferencesModel, Sim } from "scenerystack/sim";
import { Tandem } from "scenerystack/tandem";
import { StringManager } from "./i18n/StringManager.js";
import RadioWavesColors from "./RadioWavesColors.js";
import radioWaves from "./RadioWavesNamespace.js";
import { RadioWavesScreen } from "./radio-waves/RadioWavesScreen.js";

onReadyToLaunch(() => {
  const stringManager = StringManager.getInstance();

  const screens = [
    new RadioWavesScreen({
      name: stringManager.getScreenNames().radioWavesStringProperty,
      tandem: Tandem.ROOT.createTandem("radioWavesScreen"),
      backgroundColorProperty: RadioWavesColors.backgroundColorProperty,
    }),
  ];

  const simOptions = {
    preferencesModel: new PreferencesModel({
      visualOptions: {
        supportsProjectorMode: true,
        supportsInteractiveHighlights: true,
      },
      localizationOptions: {
        supportsDynamicLocale: true,
      },
    }),
  };

  const sim = new Sim(stringManager.getTitleStringProperty(), screens, simOptions);
  radioWaves.register("sim", sim);
  sim.start();
});
