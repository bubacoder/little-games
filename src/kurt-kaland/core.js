// A hangmérés és a gyakorlási szabályok a játéktól függetlenül tesztelhetők.
export const cents = (hz, target) => 1200 * Math.log2(hz / target);
export const midiHz = midi => 440 * 2 ** ((midi - 69) / 12);
export function noteName(hz) {
  if (!(hz > 0)) return '–';
  const midi = Math.round(69 + 12 * Math.log2(hz / 440));
  return ['C', 'Cisz', 'D', 'Esz', 'E', 'F', 'Fisz', 'G', 'Asz', 'A', 'B♭', 'H'][((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

// YIN: az első megbízható periódusminimumot keressük, nem a leghangosabb felhangot.
export function detectPitch(samples, sampleRate, threshold = 0.008) {
  let mean = 0;
  for (const v of samples) mean += v;
  mean /= samples.length;
  let power = 0;
  for (const v of samples) power += (v - mean) ** 2;
  const rms = Math.sqrt(power / samples.length);
  if (rms < threshold) return { hz: 0, rms, confidence: 0 };
  // Az erősen változó hangindítást megvárjuk: ne találjunk benne hamis alaphangot.
  let quietest = Infinity, loudest = 0;
  for (let start = 0; start + 512 <= samples.length; start += 512) {
    let block = 0;
    for (let j = start; j < start + 512; j++) block += (samples[j] - mean) ** 2;
    const level = Math.sqrt(block / 512);
    quietest = Math.min(quietest, level); loudest = Math.max(loudest, level);
  }
  if (loudest > Math.max(threshold, quietest) * 1.45) return { hz: 0, rms, confidence: 0 };
  const max = Math.min(Math.floor(sampleRate / 65), Math.floor(samples.length / 2) - 1);
  const min = Math.max(2, Math.floor(sampleRate / 1200));
  const window = samples.length - max;
  const difference = new Float32Array(max + 1);
  let cumulative = 0;
  difference[0] = 1;
  for (let lag = 1; lag <= max; lag++) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      const d = samples[j] - samples[j + lag];
      sum += d * d;
    }
    cumulative += sum;
    difference[lag] = cumulative ? sum * lag / cumulative : 1;
  }
  for (let lag = min; lag < max - 1; lag++) {
    if (difference[lag] < 0.13) {
      while (lag + 1 < max && difference[lag + 1] < difference[lag]) lag++;
      const a = difference[lag - 1], b = difference[lag], c = difference[lag + 1];
      const denominator = 2 * (2 * b - a - c);
      const offset = denominator ? (c - a) / denominator : 0;
      const hz = sampleRate / (lag + Math.max(-0.5, Math.min(0.5, offset)));
      return { hz: hz >= 65 && hz <= 1200 ? hz : 0, rms, confidence: 1 - b };
    }
  }
  return { hz: 0, rms, confidence: 0 };
}

// A félhangok közötti pontos holtverseny nem találat; az oktáv számít.
export function matchPitch(hz, notes, tolerance) {
  if (!(hz > 0)) return -1;
  const distances = notes.map(n => Math.abs(cents(hz, n.hz)));
  const sorted = distances.map((d, i) => ({ d, i })).sort((a, b) => a.d - b.d);
  if (!sorted.length || sorted[0].d > tolerance + 1e-7) return -1;
  if (sorted[1] && Math.abs(sorted[1].d - sorted[0].d) < 0.01) return -1;
  return sorted[0].i;
}

export function createTask(index, settings, notes) {
  const type = settings.mode === 'mixed' ? ['short', 'repeat', 'hold', 'short', 'hold', 'repeat'][index % 6] : settings.mode;
  return { type, note: index % notes.length, needed: type === 'repeat' ? 2 + Math.floor(index / 3) % 3 : 1,
    duration: type === 'hold' ? settings.hold : 0.15 };
}

export class TaskJudge {
  constructor(task) {
    this.task = task;
    this.reset();
  }
  reset() {
    this.count = 0; this.held = 0; this.stable = 0; this.gap = 0;
    this.silence = 0.12; this.armed = true; this.done = false;
  }
  // good: célhang; quiet: valódi halk szünet, nem másik hang vagy mérési bizonytalanság.
  update(good, quiet, dt) {
    if (this.done) return { success: false, onset: false };
    let onset = false;
    this.silence = quiet ? this.silence + dt : 0;
    if (this.silence >= 0.12) this.armed = true;
    if (good) {
      this.gap = 0;
      this.stable += dt;
      if (this.task.type === 'hold' && (this.armed || this.count > 0)) this.held += dt;
      if (this.stable >= 0.15 - 1e-8 && this.armed) {
        this.count++; this.armed = false; onset = true;
      }
    } else {
      this.stable = 0;
      this.gap += dt;
      if (this.gap > 0.15) this.held = 0;
    }
    const success = this.task.type === 'hold' ? this.held >= this.task.duration - 1e-8 : this.count >= this.task.needed;
    if (success) this.done = true;
    return { success, onset };
  }
  get progress() {
    return Math.min(1, this.task.type === 'hold' ? this.held / this.task.duration : (this.count + (this.armed ? Math.min(0.95, this.stable / 0.15) : 0)) / this.task.needed);
  }
}
