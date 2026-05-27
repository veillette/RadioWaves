# Radio Waves & Electromagnetic Fields

A [SceneryStack](https://scenerystack.org/) (TypeScript) port of the PhET
*Radio Waves & Electromagnetic Fields* simulation, rebuilt from the legacy
PIXI.js + Backbone implementation.

Wiggle the electron in the transmitting antenna — by hand or with the
sinusoidal oscillator — and watch the radiated electric field propagate
outward and drive the electron in the distant receiving antenna.

## Features

- **Transmitter movement:** drag the electron manually, or switch to
  **Oscillate** and set the **frequency** and **amplitude**.
- **Field display:** *Curve with Vectors*, *Curve*, *Full Field* (2-D arrow
  grid), or *None*.
- **Field sense:** show the force on an electron, or the electric field
  direction.
- **Field displayed:** the *radiated* (dynamic) field or the *static* field.
- **Electron Positions:** scrolling oscilloscope plots of the transmitter and
  receiver electron motion.
- Play / pause / step controls, light & projector color profiles, English and
  French localization, and PWA installability.

## Requirements

- [Node.js](https://nodejs.org/) 22 or later and npm

## Development

```sh
npm install
npm run dev      # http://localhost:5173
```

## Building

```sh
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Quality checks

```sh
npm run check    # TypeScript type-check (src + scripts)
npm run lint     # Biome lint + format check
npm run icons    # regenerate PWA icons from public/icons/icon.svg
```

## License

MIT. The original simulation is Copyright © Rice University, distributed under
the GNU AGPL; this is an independent reimplementation.
