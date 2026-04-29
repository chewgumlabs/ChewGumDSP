import { midiToFrequency } from './midi.js';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function scheduleVoice(audioContext, { type, frequency, peak, decay, time, destination, periodicWave }) {
  const oscillator = new OscillatorNode(audioContext, { type });
  const gain = new GainNode(audioContext, { gain: 0.0001 });

  if (periodicWave) {
    oscillator.setPeriodicWave(periodicWave);
  }

  oscillator.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.42), time + decay * 0.35);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(time);
  oscillator.stop(time + decay + 0.1);
}

export function strikeBell(audioContext, destination, periodicWave, options = {}) {
  const { midi = 69, intensity = 1, pan = 0 } = options;

  const time = audioContext.currentTime + 0.01;
  const clampedIntensity = clamp(intensity, 0.18, 1.2);
  const fundamental = midiToFrequency(midi);

  const output = typeof StereoPannerNode === 'function'
    ? new StereoPannerNode(audioContext, { pan: clamp(pan, -1, 1) })
    : new GainNode(audioContext);
  output.connect(destination);

  const filter = new BiquadFilterNode(audioContext, {
    type: 'bandpass',
    frequency: Math.min(3200, fundamental * 2.2),
    Q: 2.4,
  });
  filter.connect(output);

  const bus = new GainNode(audioContext, { gain: 1 });
  bus.connect(output);

  const shimmer = new GainNode(audioContext, { gain: 1 });
  shimmer.connect(filter);

  scheduleVoice(audioContext, {
    type: 'triangle',
    frequency: fundamental,
    peak: 0.08 * clampedIntensity,
    decay: 1.45,
    time,
    destination: bus,
    periodicWave,
  });

  scheduleVoice(audioContext, {
    type: 'sine',
    frequency: fundamental * 2.01,
    peak: 0.07 * clampedIntensity,
    decay: 1.08,
    time,
    destination: shimmer,
  });

  scheduleVoice(audioContext, {
    type: 'sine',
    frequency: fundamental * 3.17,
    peak: 0.05 * clampedIntensity,
    decay: 0.8,
    time,
    destination: shimmer,
  });

  setTimeout(() => {
    output.disconnect();
    bus.disconnect();
    shimmer.disconnect();
    filter.disconnect();
  }, 2200);
}
