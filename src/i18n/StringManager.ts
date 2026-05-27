/**
 * StringManager.ts
 *
 * Centralizes string management for Radio Waves & Electromagnetic Fields.
 * Provides access to localized strings for all components.
 */

import { LocalizedString, type ReadOnlyProperty } from "scenerystack";
import radioWaves from "../RadioWavesNamespace.js";
import stringsEn from "./strings_en.json";
import stringsFr from "./strings_fr.json";

// ── Compile-time key-parity check ─────────────────────────────────────────────
// satisfies errors immediately if either locale file is missing keys from the other.
// biome-ignore lint/complexity/noVoid: intentional compile-time type assertion
void (stringsEn satisfies typeof stringsFr);
// biome-ignore lint/complexity/noVoid: intentional compile-time type assertion
void (stringsFr satisfies typeof stringsEn);

export class StringManager {
  private static instance: StringManager;
  private readonly stringProperties;

  private constructor() {
    this.stringProperties = LocalizedString.getNestedStringProperties({
      en: stringsEn,
      fr: stringsFr,
    });
  }

  public static getInstance(): StringManager {
    if (!StringManager.instance) {
      StringManager.instance = new StringManager();
      radioWaves.register("StringManager", StringManager.instance);
    }
    return StringManager.instance;
  }

  public getTitleStringProperty(): ReadOnlyProperty<string> {
    return this.stringProperties.titleStringProperty;
  }

  public getScreenNames(): { radioWavesStringProperty: ReadOnlyProperty<string> } {
    return {
      radioWavesStringProperty: this.stringProperties.screens.radioWavesStringProperty,
    };
  }

  public getTransmitterMovementStrings() {
    return this.stringProperties.transmitterMovement;
  }

  public getFieldDisplayTypeStrings() {
    return this.stringProperties.fieldDisplayType;
  }

  public getFieldSenseStrings() {
    return this.stringProperties.fieldSense;
  }

  public getFieldDisplayedStrings() {
    return this.stringProperties.fieldDisplayed;
  }

  public getElectronPositionsStringProperty(): ReadOnlyProperty<string> {
    return this.stringProperties.electronPositionsStringProperty;
  }

  public getPlotStrings() {
    return this.stringProperties.plots;
  }

  public getLegendStrings() {
    return this.stringProperties.legend;
  }
}
