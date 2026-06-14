/**
 * radioWavesQueryParameters.ts
 *
 * Sim-specific startup query parameters for Radio Waves. All entries are public
 * and provide the initial values for the sim-specific preferences in
 * RadioWavesPreferencesModel.
 *
 * Usage: append e.g. `?showPositionPlots=true` to the sim URL.
 */

import { logGlobal } from "scenerystack/phet-core";
import { QueryStringMachine } from "scenerystack/query-string-machine";
import RadioWavesNamespace from "../RadioWavesNamespace.js";

const radioWavesQueryParameters = QueryStringMachine.getAll({
  /** Whether the position-vs-time plots are shown by default. */
  showPositionPlots: {
    type: "boolean",
    defaultValue: false,
    public: true,
  },
});

RadioWavesNamespace.register("radioWavesQueryParameters", radioWavesQueryParameters);

// Log query parameters (for the console / PhET-iO).
logGlobal("phet.chipper.queryParameters");

export default radioWavesQueryParameters;
