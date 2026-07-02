// audio.js — צלילים פרוצדורליים (WebAudio) + הקראה קולית בעברית (Web Speech)
// אין צורך בקבצי שמע חיצוניים. הכל נוצר בזמן אמת.

const Audio = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxOn: true,
  voiceOn: true,
  musicOn: true,
  heVoice: null,
  _musicTimer: null,
  _anthemTimer: null,
  _anthemKey: null,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.12;
      this.musicGain.connect(this.master);
    } catch (e) { /* no audio */ }
    this._loadVoice();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => this._loadVoice();
    }
  },

  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },

  _loadVoice() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    this.heVoice = voices.find(v => /he|iw/i.test(v.lang)) || null;
  },

  _tone(freq, dur, type = 'sine', vol = 0.3, when = 0) {
    if (!this.ctx || !this.sfxOn) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  },

  click() { this._tone(420, 0.08, 'triangle', 0.18); },
  pop()   { this._tone(660, 0.1, 'sine', 0.2); this._tone(990, 0.12, 'sine', 0.12, 0.04); },
  coin()  { this._tone(880, 0.09, 'square', 0.12); this._tone(1320, 0.12, 'square', 0.1, 0.07); },

  success() {
    const notes = [523, 659, 784, 1046]; // do mi sol do
    notes.forEach((f, i) => this._tone(f, 0.18, 'triangle', 0.22, i * 0.09));
  },

  fanfare() {
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    notes.forEach((f, i) => this._tone(f, 0.22, 'sawtooth', 0.16, i * 0.12));
  },

  // תרועת-קהל לניצחון/גול — רעש-קהל שוצף + שריקת שופט (פרוצדורלי, בלי קבצים)
  crowdCheer() {
    if (!this.ctx || !this.sfxOn) return;
    const t = this.ctx.currentTime;
    const dur = 1.5;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let k = 0; k < data.length; k++) data[k] = (Math.random() * 2 - 1);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.setValueAtTime(700, t);
    bp.frequency.linearRampToValueAtTime(1400, t + 0.5); // שאגת קהל עולה
    bp.Q.value = 0.6;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.34, t + 0.35);
    g.gain.linearRampToValueAtTime(0.26, t + 0.95);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur);
    // שריקת שופט קצרה מעל השאגה
    this._tone(1950, 0.16, 'square', 0.12, 0.05);
    this._tone(1780, 0.12, 'square', 0.10, 0.22);
  },

  wrong() {
    // צליל רך ולא מעניש
    this._tone(330, 0.18, 'sine', 0.16);
    this._tone(247, 0.26, 'sine', 0.14, 0.12);
  },

  // קולות חיות פרוצדורליים (קירוב חמוד) — [תדר, משך, השהיה]
  animalSound(type) {
    if (!this.ctx || !this.sfxOn) return;
    const P = {
      horse:   [['sawtooth', 260, 0.22, 0], ['sawtooth', 300, 0.18, 0.16], ['sawtooth', 230, 0.2, 0.32]],
      cow:     [['sawtooth', 175, 0.35, 0], ['sawtooth', 150, 0.45, 0.22]],
      chicken: [['square', 950, 0.06, 0], ['square', 1150, 0.05, 0.09], ['square', 820, 0.07, 0.18]],
      sheep:   [['sawtooth', 400, 0.28, 0], ['sawtooth', 340, 0.3, 0.2]],
      pig:     [['square', 200, 0.07, 0], ['square', 175, 0.07, 0.09], ['square', 160, 0.09, 0.18]],
      dog:     [['square', 320, 0.1, 0], ['square', 270, 0.12, 0.13]],
      cat:     [['sine', 680, 0.18, 0], ['sine', 820, 0.22, 0.13]],
      duck:    [['square', 520, 0.07, 0], ['square', 470, 0.07, 0.09], ['square', 520, 0.07, 0.18]]
    }[type] || [['triangle', 440, 0.12, 0]];
    P.forEach(([w, f, d, delay]) => this._tone(f, d, w, 0.16, delay));
  },

  // צליל-רקע קצר ייחודי לכל אזור (בכניסה)
  areaAmbient(id) {
    if (!this.ctx || !this.sfxOn) return;
    const cues = {
      farm:     [['sine', 523, 0.15, 0], ['sine', 659, 0.16, 0.12]],
      forest:   [['sine', 900, 0.07, 0], ['sine', 1150, 0.06, 0.1], ['sine', 990, 0.08, 0.22]],  // ציוץ ציפורים
      lake:     [['sine', 420, 0.12, 0], ['sine', 300, 0.18, 0.14]],                              // בלבול מים
      village:  [['triangle', 660, 0.12, 0], ['triangle', 880, 0.15, 0.14]],                      // פעמון כפר
      mountain: [['sine', 196, 0.3, 0.0], ['sine', 165, 0.38, 0.18]],                             // רוח הרים
      fair:     [['triangle', 659, 0.12, 0], ['triangle', 784, 0.12, 0.12], ['triangle', 988, 0.16, 0.24]] // לחן קרנבל עליז
    }[id] || [['sine', 523, 0.15, 0]];
    cues.forEach(([w, f, d, delay]) => this._tone(f, d, w, 0.14, delay));
  },

  speak(text) {
    if (!this.voiceOn || !window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'he-IL';
      if (this.heVoice) u.voice = this.heVoice;
      u.rate = 0.92; u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  },

  stopSpeak() { if (window.speechSynthesis) window.speechSynthesis.cancel(); },

  praise() {
    const phrases = ['גול!', 'כל הכבוד, אלוף!', 'מעולה!', 'שער מנצח!', 'אתה אלוף!', 'נכון מאוד!', 'וואו, מדהים!', 'יש! הקהל מריע לך!'];
    this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
  },

  tryAgain() {
    const phrases = ['כמעט גול! נסה שוב', 'לא נורא, אלוף, ננסה עוד פעם', 'קרוב מאוד לשער, נסה שוב'];
    this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
  },

  // מוזיקת רקע עדינה — ארפג'ו רך בלולאה
  startMusic() {
    if (!this.ctx || !this.musicOn || this._musicTimer) return;
    const scale = [392, 440, 523, 587, 659, 784]; // סולם נעים
    let i = 0;
    const step = () => {
      if (!this.musicOn) return;
      const f = scale[i % scale.length];
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.5, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
      o.connect(g); g.connect(this.musicGain);
      o.start(t); o.stop(t + 1.2);
      i++;
      this._musicTimer = setTimeout(step, 620);
    };
    step();
  },

  stopMusic() {
    this.musicOn = false;
    if (this._musicTimer) { clearTimeout(this._musicTimer); this._musicTimer = null; }
  },

  setMusic(on) {
    this.musicOn = on;
    if (on) this.startMusic(); else this.stopMusic();
  },

  // ── מנוע אנתם פר-מועדון ─────────────────────────────────────────────
  // מוטיבים מקוריים (לא הקלטות אמיתיות — קופירייט) שתופסים את אופי הקבוצה.
  // כל seq = מערך צעדים [תדר-מלודיה, תדר-בס]; 0 = שתיקה. לופ אינסופי לפי step(ms).
  _ANTHEMS: {
    // בית"ר — מארש נמרץ מינורי-מזרחי (סולם פריגיש/חיג'אז על מי, סקסטה מוגברת)
    beitar: {
      step: 300, lead: 'sawtooth', bass: 'square', leadVol: 0.5, bassVol: 0.42,
      seq: [
        [329.63, 164.81], [349.23, 164.81], [415.30, 123.47], [349.23, 164.81],
        [329.63, 164.81], [293.66, 123.47], [261.63, 164.81], [293.66, 123.47],
        [329.63, 164.81], [0, 123.47],      [493.88, 164.81], [523.25, 123.47],
        [493.88, 164.81], [440.00, 123.47], [415.30, 164.81], [329.63, 123.47]
      ]
    },
    // מכבי חיפה — אנתם ים-תיכוני מנצח ובהיר (דו מז'ור עולה, מתרומם)
    maccabihaifa: {
      step: 335, lead: 'triangle', bass: 'triangle', leadVol: 0.5, bassVol: 0.38,
      seq: [
        [392.00, 130.81], [523.25, 196.00], [659.25, 130.81], [783.99, 196.00],
        [659.25, 130.81], [523.25, 196.00], [587.33, 146.83], [659.25, 196.00],
        [698.46, 174.61], [659.25, 146.83], [587.33, 196.00], [523.25, 130.81],
        [783.99, 196.00], [1046.50, 261.63], [783.99, 196.00], [0, 130.81]
      ]
    },
    // מכבי ת"א — אנתם קלאסי גאה (סול מז'ור, מהודר, צעדים מוחזקים)
    maccabitlv: {
      step: 430, lead: 'square', bass: 'triangle', leadVol: 0.42, bassVol: 0.4,
      seq: [
        [392.00, 196.00], [392.00, 196.00], [493.88, 146.83], [587.33, 196.00],
        [493.88, 146.83], [392.00, 196.00], [440.00, 220.00], [493.88, 146.83],
        [587.33, 196.00], [493.88, 146.83], [440.00, 220.00], [392.00, 196.00],
        [783.99, 196.00], [587.33, 146.83], [493.88, 196.00], [392.00, 196.00]
      ]
    },
    // הפועל ב"ש — מארש דרומי אנרגטי (פה מז'ור מקפיץ, בס מסונקף)
    hapoelbs: {
      step: 250, lead: 'square', bass: 'sawtooth', leadVol: 0.46, bassVol: 0.4,
      seq: [
        [349.23, 174.61], [349.23, 0],      [440.00, 174.61], [523.25, 0],
        [698.46, 174.61], [523.25, 0],      [440.00, 130.81], [349.23, 0],
        [392.00, 196.00], [392.00, 0],      [523.25, 196.00], [587.33, 0],
        [698.46, 174.61], [523.25, 0],      [440.00, 174.61], [349.23, 0]
      ]
    }
  },

  _anthemNote(freq, dur, type, vol) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + dur + 0.03);
  },

  // מנגן את אנתם המועדון (clubKey: beitar/maccabihaifa/maccabitlv/hapoelbs)
  // מכבד את settings.music דרך this.musicOn. מחליף מוזיקת-רקע גנרית אם רצה.
  playAnthem(clubKey) {
    const cfg = this._ANTHEMS[clubKey];
    if (!cfg) return;
    if (!this.ctx || !this.musicOn) return;          // מכבד את settings.music
    if (this._anthemKey === clubKey && this._anthemTimer) return; // כבר מנגן
    this.stopAnthem();
    // האנתם מחליף את הארפג'ו הגנרי — עוצר אותו בלי לכבות את music
    if (this._musicTimer) { clearTimeout(this._musicTimer); this._musicTimer = null; }
    this._anthemKey = clubKey;
    const seq = cfg.seq, n = seq.length, stepMs = cfg.step;
    let i = 0;
    const play = () => {
      if (!this.musicOn || this._anthemKey !== clubKey) { this._anthemTimer = null; return; }
      const [lead, bass] = seq[i % n];
      if (lead) this._anthemNote(lead, stepMs / 1000 * 0.9, cfg.lead, cfg.leadVol);
      if (bass) this._anthemNote(bass, stepMs / 1000 * 0.7, cfg.bass, cfg.bassVol);
      i++;
      this._anthemTimer = setTimeout(play, stepMs);
    };
    play();
  },

  stopAnthem() {
    this._anthemKey = null;
    if (this._anthemTimer) { clearTimeout(this._anthemTimer); this._anthemTimer = null; }
  }
};

export { Audio };
