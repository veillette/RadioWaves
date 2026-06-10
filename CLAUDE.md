# CLAUDE.md — Radio Waves

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenPhysics/.github/CLAUDE.md](https://github.com/OpenPhysics/.github/blob/main/CLAUDE.md).

## Project

SceneryStack port of the PhET *Radio Waves & Electromagnetic Fields* simulation (rebuilt from legacy PIXI.js + Backbone). Single screen: transmitting/receiving antennae, field visualization modes, oscilloscope electron plots.

## Key files

| Area | Location |
|---|---|
| Screen | `src/radio-waves/RadioWavesScreen.ts` |
| Model | `src/radio-waves/model/` — electron motion, field sampling, oscilloscope data |
| View | `src/radio-waves/view/` — antenna nodes, field display, control panel |
| Colors | `RadioWavesColors.ts`, `RadioWavesNamespace.ts` |

## Notes

- Field display modes: curve with vectors, curve, full field grid, or none
- Toggle radiated vs static field; force-on-electron vs E-field direction
- English and French UI via `StringManager`
