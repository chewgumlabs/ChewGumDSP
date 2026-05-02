# chewgum-dsp

The smallest public ESM extraction of the NES-style triangle-wave generator
and bell-tone helper used in pieces shipped on shanecurry.com.

Version 0.1.0.

## What this is

Three functions, faithfully extracted from the audio code embedded in two
publicly shipped pieces. No private DSP work is included.

- `createNesTriangleWave(audioContext)` — returns a Web Audio `PeriodicWave`
  built from a 32-step NES-style source table, projected onto 24
  cosine/sine harmonics with the DC offset removed.
- `midiToFrequency(midi)` — convert a MIDI note number to frequency in Hz.
- `strikeBell(audioContext, destination, periodicWave, options)` — trigger
  a 3-voice bell tone (triangle fundamental plus two sine harmonics through
  a bandpass filter). Options: `midi`, `intensity`, `pan`. If
  `periodicWave` is `null`, the triangle voice falls back to the browser's
  native `oscillator.type = 'triangle'`. The example uses both modes for
  an A/B contrast.

## What's NOT in v0

Out of scope. May or may not graduate to public extractions over time:

- OPL2 emulation
- AudioWorklet wrappers
- Stroke-based interpretation contexts
- The larger private ChewGum DSP work

## Deployed lineage

`createNesTriangleWave` and the bell synthesis pattern in `strikeBell` are
deployed in two pieces on shanecurry.com:

- [Dead Beat](https://shanecurry.com/lab/toys/dead-beat/) — bell tones
  triggered from rhythmic interaction.
- [Falling Hall](https://shanecurry.com/lab/toys/falling-hall/) —
  wall-strike chimes when the player hits the tunnel walls.

[Phosphor](https://shanecurry.com/lab/toys/phosphor/) is a sibling production
that uses the browser's native triangle oscillator instead. Phosphor is
the contrast point in the example below, not a deployment of this
library.

## Example: Native Triangle vs. NES-Style Triangle

`examples/native-vs-nes/` ships an A/B demo: two buttons trigger the same
bell synthesis through the same envelope and bandpass filter, differing
only in the triangle wave source. The NES-style side passes a
`createNesTriangleWave` `PeriodicWave` to `strikeBell`. The native side
passes `null` and `strikeBell` falls back to the browser's built-in
`oscillator.type = 'triangle'`.

This makes the library's reason to exist audible: a 32-step NES-style
source table reconstructed as a 24-harmonic `PeriodicWave` is a different
artifact from the browser's native triangle oscillator.

## Install

This is a small ESM library with no dependencies and no build step. Copy
`src/` into your project, or once published, install via npm.

```sh
npm install @chewgum/dsp
```

## Usage

```js
import { createNesTriangleWave, strikeBell } from '@chewgum/dsp';

const audioContext = new AudioContext();
const masterGain = new GainNode(audioContext, { gain: 0.16 });
masterGain.connect(audioContext.destination);

const triangleWave = createNesTriangleWave(audioContext);

document.querySelector('#ring').addEventListener('click', async () => {
  await audioContext.resume();
  strikeBell(audioContext, masterGain, triangleWave, { midi: 69, intensity: 0.9 });
});
```

See `examples/native-vs-nes/` for the runnable A/B demo.

## License

MIT. Attributed to Shane Curry / ChewGum Labs.
