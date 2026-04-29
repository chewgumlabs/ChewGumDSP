export function createNesTriangleWave(audioContext) {
  const stepValues = [
    15, 14, 13, 12, 11, 10, 9, 8,
    7, 6, 5, 4, 3, 2, 1, 0,
    0, 1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15,
  ];
  const normalized = stepValues.map((value) => (value / 15) * 2 - 1);
  const mean =
    normalized.reduce((sum, value) => sum + value, 0) / normalized.length;
  const samples = normalized.map((value) => value - mean);
  const harmonicCount = 24;
  const real = new Float32Array(harmonicCount + 1);
  const imag = new Float32Array(harmonicCount + 1);

  for (let harmonic = 1; harmonic <= harmonicCount; harmonic += 1) {
    let cosineSum = 0;
    let sineSum = 0;

    for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
      const phase = (2 * Math.PI * harmonic * sampleIndex) / samples.length;
      cosineSum += samples[sampleIndex] * Math.cos(phase);
      sineSum += samples[sampleIndex] * Math.sin(phase);
    }

    real[harmonic] = (2 / samples.length) * cosineSum;
    imag[harmonic] = (2 / samples.length) * sineSum;
  }

  return audioContext.createPeriodicWave(real, imag, {
    disableNormalization: true,
  });
}
