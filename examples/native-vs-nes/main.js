import { createNesTriangleWave, strikeBell } from '../../src/index.js';

const buttonNative = document.getElementById('ring-native');
const buttonNes = document.getElementById('ring-nes');
const status = document.getElementById('status');

const SCALE = [69, 72, 76, 79, 81, 84];

let audioContext = null;
let masterGain = null;
let triangleWave = null;

async function ensureAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = new GainNode(audioContext, { gain: 0.16 });
    masterGain.connect(audioContext.destination);
    triangleWave = createNesTriangleWave(audioContext);
  }
  await audioContext.resume();
}

function pickMidi() {
  return SCALE[Math.floor(Math.random() * SCALE.length)];
}

buttonNative.addEventListener('click', async () => {
  await ensureAudio();
  const midi = pickMidi();
  strikeBell(audioContext, masterGain, null, { midi, intensity: 0.9 });
  status.textContent = `Native triangle · MIDI ${midi}`;
});

buttonNes.addEventListener('click', async () => {
  await ensureAudio();
  const midi = pickMidi();
  strikeBell(audioContext, masterGain, triangleWave, { midi, intensity: 0.9 });
  status.textContent = `NES-style PeriodicWave · MIDI ${midi}`;
});
