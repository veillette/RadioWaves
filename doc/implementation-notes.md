# Implementation Notes - Radio Waves Simulation

## Architecture Overview

The Radio Waves simulation is structured using a Model-View pattern for electromagnetic wave propagation between transmitting and receiving antennas. It is a SceneryStack port of the PhET *Radio Waves* simulation.

### High-Level Architecture

The simulation follows a modular architecture:

- **Model Layer (`src/radio-waves/model/`)**: Antennas, electrons, movement strategies, and field display state
- **View Layer (`src/radio-waves/view/`)**: Field lattice, oscilloscope plots, antennas, and control panels

`RadioWavesModel` fuses two antennas, two electrons, movement strategies, and all control state into one coordinator class.

### Model-View Transform

The model world is 1000×700 units. `ModelViewTransform2.createSinglePointScaleMapping()` maps model to view with non-inverted Y.

## Model Components

### Core Model Design

`RadioWavesModel` owns transmitter and receiver antennas, transmitting and sensing electrons, and all user-facing display options.

### Component Specialization

Each model component has a single responsibility:

1. **Electron**: Transmitting electron with position history
2. **EmfSensingElectron**: Receiving electron driven by retarded source field
3. **Antenna**: Position constraints for electrons
4. **MovementStrategy**: Manual vs sinusoidal transmitter motion (`ManualMovementStrategy`, `SinusoidalMovementStrategy`)

Field display is controlled by enums: `FieldDisplayType`, `FieldSense`, and `FieldDisplayed`.

### Physics Simulation Approach

Integration uses a fixed timestep with accumulator. A `steppedEmitter` provides a view sampling cadence decoupled from the integration rate.

Constants live in `RadioWavesConstants.ts`.

## View Components

### RadioWavesScreenView as Coordinator

The screen view lays out the play area, control column, and bottom play/step controls.

Specialized view classes handle specific visualization aspects:

1. **FieldLatticeNode**: E-field visualization in curve+vectors, curve, full grid, or none modes
2. **AntennaNode**, **ElectronNode**: Hardware rendering
3. **ElectronPositionPlotNode**: Oscilloscope-style position plots
4. **FieldControlPanel**: Field display mode, radiated vs static, force vs E-field direction
5. **TransmitterMovementPanel**: Manual vs sinusoidal motion, frequency, and amplitude
6. **BackgroundSceneNode**, **LegendNode**: Scene backdrop and legend

### Color Scheme

Colors are defined in `RadioWavesColors.ts` as `ProfileColorProperty` instances. Field arrow colors should remain neutral relative to electron colors.

### Performance Optimizations

- Full field grid mode is the most expensive display option; curve-only modes reduce lattice work
- Position history for oscilloscope plots is bounded by model constraints

Note that no dispose functions have been used, which should be addressed.
