# Radio Waves & Electromagnetic Fields

A [SceneryStack](https://scenerystack.org/) port of the PhET *Radio Waves & Electromagnetic Fields*
simulation. Wiggle the electron in the transmitting antenna — by hand or with the sinusoidal oscillator —
and watch the radiated electric field propagate outward and drive the electron in the distant receiving
antenna.

## Features

- **Transmitter movement:** drag the electron manually, or switch to **Oscillate** and set the **frequency**
  and **amplitude**.
- **Field display:** *Curve with Vectors*, *Curve*, *Full Field* (2-D arrow grid), or *None*.
- **Field sense:** show the force on an electron, or the electric field direction.
- **Field displayed:** the *radiated* (dynamic) field or the *static* field.
- **Electron Positions:** scrolling oscilloscope plots of the transmitter and receiver electron motion.
- Play / pause / step controls, light & projector color profiles, English and French localization, and PWA
  installability.

## Quick Start

```bash
npm install
npm run icons    # generate PWA icons from public/icons/icon.svg
npm start        # dev server → http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `npm start` / `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | TypeScript type check (`src` + `scripts`) |
| `npm run lint` | Biome lint check |
| `npm run format` | Auto-format all files |
| `npm run fix` | Lint + auto-fix |
| `npm run icons` | Regenerate PWA icons from `public/icons/icon.svg` |
| `npm run clean` | Remove `dist/` |

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [SceneryStack](https://scenerystack.org/) | ^3.0.0 | Simulation framework |
| [Vite](https://vitejs.dev/) | ^8 | Build tool + dev server |
| [TypeScript](https://www.typescriptlang.org/) | ^6 | Type-safe JavaScript |
| [Biome](https://biomejs.dev/) | ^2.4 | Linting + formatting |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | ^1 | PWA + service worker |

## License

MIT. The original simulation is Copyright © Rice University, distributed under the GNU AGPL; this is an
independent reimplementation.

## Contributing

See [OpenPhysics contributing guidelines](https://github.com/OpenPhysics/.github/blob/main/CONTRIBUTING.md).
Report bugs via GitHub Issues; use org issue templates.
