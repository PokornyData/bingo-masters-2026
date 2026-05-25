// Procedural lo-fi chiptune engine.
// Loopable 4-chord progression (Am - F - C - G) with bass, arp, melody and soft noise hat.
// Exposes window.chiptune = { start(), stop(), toggle(), isPlaying(), setVolume(v), getVolume() }.

(function () {
  const KEY_VOL = "pixelBingo2026.musicVolume";
  const KEY_ON = "pixelBingo2026.musicOn";

  let ctx = null;
  let masterGain = null;
  let playing = false;
  let stopTimer = null;
  let savedVolume = parseFloat(localStorage.getItem(KEY_VOL));
  if (isNaN(savedVolume)) savedVolume = 0.35;

  // Note frequencies (A minor pentatonic / diatonic helpers)
  const N = (semitonesFromA4) => 440 * Math.pow(2, semitonesFromA4 / 12);
  // MIDI-ish: A4 = 0, so C5=3, D5=5, E5=7, G5=10, A5=12, etc.
  const NOTES = {
    A2: N(-24), C3: N(-21), D3: N(-19), E3: N(-17), F3: N(-16), G3: N(-14),
    A3: N(-12), C4: N(-9), D4: N(-7), E4: N(-5), F4: N(-4), G4: N(-2),
    A4: N(0), B4: N(2), C5: N(3), D5: N(5), E5: N(7), F5: N(8), G5: N(10), A5: N(12),
  };

  // 4-chord progression. Each chord: [bassNote, arpNotes[4], melodyNotes[8]]
  // Beats per chord: 8 (sixteenths) → arp plays 4 sixteenths, melody 8 sixteenths.
  // Total loop: 4 chords × 8 sixteenths = 32 sixteenths.
  const PROG = [
    { // Am
      bass: "A2",
      arp: ["A3", "C4", "E4", "C4"],
      melody: ["A4", null, "C5", null, "E5", "D5", "C5", null],
    },
    { // F
      bass: "F3",
      arp: ["F3", "A3", "C4", "A3"],
      melody: ["C5", null, "A4", null, "F4", "G4", "A4", null],
    },
    { // C
      bass: "C3",
      arp: ["C4", "E4", "G4", "E4"],
      melody: [null, "G4", "E5", "D5", "C5", null, "G4", null],
    },
    { // G
      bass: "G3",
      arp: ["G3", "B4", "D5", "B4"],
      melody: ["D5", null, "B4", null, "G4", "A4", "B4", null],
    },
  ];

  const BPM = 78;
  const SIXTEENTH = 60 / BPM / 4; // duration of one sixteenth note in seconds

  function ensureCtx() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = savedVolume;
    // Soft lowpass for lo-fi feel
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3200;
    filter.Q.value = 0.4;
    masterGain.connect(filter);
    filter.connect(ctx.destination);
  }

  function envBlip(freq, when, dur, type = "square", peak = 0.15) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  function bassNote(freq, when, dur) {
    // Triangle for soft bass + slight detune
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.22, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  function noiseHat(when, peak = 0.04, dur = 0.04) {
    // White noise blip via short buffer
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 5000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(hp); hp.connect(g); g.connect(masterGain);
    src.start(when);
    src.stop(when + dur + 0.02);
  }

  function scheduleLoop(startTime) {
    let t = startTime;
    for (let chordIdx = 0; chordIdx < PROG.length; chordIdx++) {
      const ch = PROG[chordIdx];
      const chordStart = t;

      // Bass: single long note for whole chord (8 sixteenths)
      bassNote(NOTES[ch.bass], chordStart, SIXTEENTH * 8 * 0.95);
      // Bass octave bump on beat 5 for movement
      bassNote(NOTES[ch.bass] * 2, chordStart + SIXTEENTH * 4, SIXTEENTH * 3.5 * 0.95);

      // Arp: 4 notes spread over 8 sixteenths (one per 2 sixteenths)
      for (let i = 0; i < 4; i++) {
        envBlip(NOTES[ch.arp[i]], chordStart + i * SIXTEENTH * 2, SIXTEENTH * 1.6, "square", 0.07);
      }

      // Melody: 8 sixteenths
      for (let i = 0; i < 8; i++) {
        const note = ch.melody[i];
        if (note) {
          envBlip(NOTES[note], chordStart + i * SIXTEENTH, SIXTEENTH * 1.3, "square", 0.1);
        }
      }

      // Soft hi-hat every other sixteenth
      for (let i = 0; i < 8; i += 2) {
        noiseHat(chordStart + i * SIXTEENTH, i % 4 === 0 ? 0.025 : 0.04);
      }

      t += SIXTEENTH * 8;
    }
    return t - startTime; // total loop length in seconds
  }

  function startLoop() {
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const lookAhead = 0.05;
    const startAt = ctx.currentTime + lookAhead;
    const loopLen = scheduleLoop(startAt);
    // schedule next iteration just before this one ends
    stopTimer = setTimeout(() => {
      if (playing) startLoop();
    }, (loopLen - 0.1) * 1000);
  }

  const api = {
    start() {
      ensureCtx();
      if (playing) return;
      playing = true;
      localStorage.setItem(KEY_ON, "1");
      startLoop();
    },
    stop() {
      playing = false;
      localStorage.setItem(KEY_ON, "0");
      if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
      if (ctx) {
        // Quickly ramp down to avoid click, then suspend
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        setTimeout(() => {
          if (ctx && !playing) {
            ctx.suspend();
            masterGain.gain.value = savedVolume;
          }
        }, 200);
      }
    },
    toggle() {
      if (playing) this.stop();
      else this.start();
      return playing;
    },
    isPlaying() { return playing; },
    setVolume(v) {
      savedVolume = Math.max(0, Math.min(1, v));
      localStorage.setItem(KEY_VOL, String(savedVolume));
      if (masterGain && playing) {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(savedVolume, ctx.currentTime + 0.05);
      }
    },
    getVolume() { return savedVolume; },
    wasPlaying() { return localStorage.getItem(KEY_ON) === "1"; },
  };

  window.chiptune = api;
})();
