(() => {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio || !document.body.classList.contains('room-ready')) return;
  let context, master, reverb, timer, nextChord = 0, nextBell = 0, chord = 0;
  const harmonies = [[130.81, 196, 246.94, 293.66], [110, 164.81, 246.94, 329.63], [146.83, 220, 261.63, 329.63], [130.81, 196, 293.66, 440]];
  function tone(frequency, start, duration, volume, pan) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const position = context.createStereoPanner();
    oscillator.frequency.value = frequency;
    position.pan.value = pan;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(volume, start + Math.min(4, duration / 4));
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(position);
    position.connect(master);
    position.connect(reverb);
    oscillator.start(start);
    oscillator.stop(start + duration + .1);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); position.disconnect(); };
  }
  function schedule() {
    if (context.state !== 'running') return;
    const now = context.currentTime;
    if (nextChord < now + 1) {
      nextChord = Math.max(nextChord, now + .1);
      harmonies[chord % harmonies.length].forEach((frequency, i) => {
        tone(frequency, nextChord + i * .35, 24, .065, (i - 1.5) / 3);
        tone(frequency * 1.002, nextChord + i * .35, 24, .018, (1.5 - i) / 3);
      });
      chord++;
      nextChord += 18;
    }
    if (nextBell < now + 1) {
      nextBell = Math.max(nextBell, now + 3);
      const notes = harmonies[(chord - 1) % harmonies.length];
      tone(notes[Math.floor(Math.random() * notes.length)] * 4, nextBell, 9, .025, Math.random() * 1.4 - .7);
      nextBell += 7 + Math.random() * 7;
    }
  }
  function initialize() {
    context = new Audio();
    master = context.createGain();
    master.gain.value = .28;
    master.connect(context.destination);
    // A diffuse, decaying room impulse keeps the sine tones soft and spacious.
    reverb = context.createConvolver();
    const impulse = context.createBuffer(2, context.sampleRate * 4, context.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    reverb.buffer = impulse;
    const wet = context.createGain();
    wet.gain.value = .45;
    reverb.connect(wet); wet.connect(master);
    context.addEventListener('statechange', schedule);
    timer = setInterval(schedule, 500);
  }
  async function start() {
    if (document.hidden) return;
    try {
      if (!context) initialize();
      await context.resume();
      if (document.hidden) await context.suspend();
      else schedule();
    } catch (_) { /* A blocked autoplay attempt can be retried by a gesture. */ }
  }
  function unlock(event) {
    if (event.type === 'keydown' && (event.metaKey || event.ctrlKey || event.altKey)) return;
    if (context?.state !== 'running') start();
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) context?.suspend().catch(() => {});
    else start();
  });
  window.addEventListener('pagehide', () => { clearInterval(timer); context?.suspend().catch(() => {}); });
  window.addEventListener('pageshow', event => {
    if (event.persisted && context) { timer = setInterval(schedule, 500); start(); }
  });
  start();
})();
