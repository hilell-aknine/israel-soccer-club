// game.js — מצב המשחק, כלכלת מטבעות, התקדמות ושמירה (localStorage)
const SAVE_KEY = 'soccer_club_v1';

// אימונים לתרגול במגרש (ללא לחץ זמן — האימון מתבשל וממתין כשמוכן)
const CROPS = {
  carrot:     { key: 'carrot',     name: 'בעיטות',       icon: '⚽', asset: 'drill_kicks.png',    seedCost: 4,  sellPrice: 10, growMs: 25000, size: 1.7 },
  wheat:      { key: 'wheat',      name: 'מסירות',       icon: '👟', asset: 'drill_passing.png',  seedCost: 6,  sellPrice: 14, growMs: 35000, size: 2.0 },
  flower:     { key: 'flower',     name: 'בעיטות לשער',  icon: '🥅', asset: 'drill_shooting.png', seedCost: 5,  sellPrice: 12, growMs: 30000, size: 1.9 },
  strawberry: { key: 'strawberry', name: 'כושר',         icon: '🏃', asset: 'drill_fitness.png',  seedCost: 7,  sellPrice: 16, growMs: 32000, size: 1.7 },
  corn:       { key: 'corn',       name: 'נגיחות ראש',   icon: '💥', asset: 'drill_heading.png',  seedCost: 8,  sellPrice: 18, growMs: 40000, size: 2.0 },
  pumpkin:    { key: 'pumpkin',    name: 'בעיטה חופשית', icon: '🎯', asset: 'drill_freekick.png', seedCost: 10, sellPrice: 24, growMs: 55000, size: 2.1 },
};

// קטלוג החנות
const SHOP = {
  // קישוט אצטדיון — פריטים שמייפים את המגרש והיציעים
  decor: [
    { id: 'tree',        name: 'דגלוני אוהדים', asset: 'pennant_flags.png', cost: 15, h: 7 },
    { id: 'flower_bush', name: 'תוף אוהדים',    asset: 'fan_drum.png',      cost: 12, h: 2.2 },
    { id: 'pond',        name: 'מסך ענק',       asset: 'big_screen.png',    cost: 45, h: 2.4 },
    { id: 'fountain',    name: 'פסל גביע',      asset: 'trophy_statue.png', cost: 50, h: 3.4 },
    { id: 'scarecrow',   name: 'קמע המועדון',   asset: 'mascot.png',        cost: 25, h: 3.4 },
    { id: 'windmill',    name: 'שער כניסה',     asset: 'turnstile.png',     cost: 60, h: 6 },
    { id: 'signpost',    name: 'שלט אצטדיון',   asset: 'sign_stadium.png',  cost: 10, h: 3 },
    { id: 'rainbow',     name: 'זיקוקי ניצחון', asset: 'fireworks.png',     cost: 70, h: 7 },
    { id: 'balloons',    name: 'בלוני מועדון',  asset: 'balloons.png',      cost: 22, h: 4 },
    { id: 'bench',       name: 'ספסל מחליפים',  asset: 'bench.png',         cost: 28, h: 2 },
    { id: 'butterfly',   name: 'צעיף אוהדים',   asset: 'fan_scarf.png',     cost: 14, h: 1.6 },
    { id: 'mushroom',    name: 'דוכן מזון',     asset: 'food_stand.png',    cost: 40, h: 3 },
    { id: 'lamp_post',   name: 'עמוד תאורה',    asset: 'lamp_post.png',     cost: 30, h: 4 },
  ],
  // מתקני אימון — משפרים את המגרש והאימונים
  equipment: [
    { id: 'trough',    name: 'חדר כושר',   asset: 'gym.png',          cost: 35, h: 2.0 },
    { id: 'well',      name: 'חדר טיפולים', asset: 'medical.png',      cost: 40, h: 3.2 },
    { id: 'saddle',    name: 'רשת שער',    asset: 'goal_net.png',     cost: 30, h: 1.8 },
    { id: 'horseshoe', name: 'מטרת אימון', asset: 'drill_target.png', cost: 20, h: 1.6 },
    { id: 'hay_bale',  name: 'מתקן כדורים', asset: 'ball_rack.png',    cost: 18, h: 2.2 },
    { id: 'feed_sack', name: 'מיכל מים',   asset: 'water_bottle.png', cost: 16, h: 2.0 },
  ],
  // מתקנים מניבי-הכנסה — מייצרים הכנסה לאורך זמן (אוספים עם תרגיל ומוכרים)
  animals: [
    { id: 'chicken', name: 'חנות המועדון', asset: 'clubshop.png',      cost: 30, scale: 1.5, produce: { emoji: '👕', intervalMs: 30000, sell: 9 } },
    { id: 'pig',     name: 'קופת כרטיסים', asset: 'ticket_office.png', cost: 50, scale: 1.9, produce: { emoji: '🎟️', intervalMs: 45000, sell: 15 } },
    { id: 'sheep',   name: 'דוכן חטיפים',  asset: 'snack_bar.png',     cost: 60, scale: 1.9, produce: { emoji: '🍿', intervalMs: 50000, sell: 18 } },
    { id: 'cow',     name: 'טרקלין VIP',   asset: 'vip_lounge.png',    cost: 90, scale: 2.3, produce: { emoji: '💰', intervalMs: 60000, sell: 26 } },
  ],
  // שדרוגים שמשנים את האצטדיון באופן נראה (פעם אחת כל אחד)
  upgrades: [
    { id: 'barn_big',    name: 'אצטדיון גדול', asset: 'stadium_big.png', cost: 120 },
    { id: 'silo',        name: 'מגדל זרקורים', asset: 'floodlight.png',  cost: 80 },
    { id: 'weathervane', name: 'לוח תוצאות',   asset: 'scoreboard.png',  cost: 35 },
  ],
};

// מאגר משימות יומיות
const QUEST_POOL = [
  { id: 'plant',   emoji: '⚽', target: 3, reward: 15, label: n => `להתחיל ${n} אימונים` },
  { id: 'harvest', emoji: '🏆', target: 2, reward: 15, label: n => `לסיים אימון ${n} פעמים` },
  { id: 'feed',    emoji: '💪', target: 3, reward: 12, label: n => `לחזק ${n} שחקנים` },
  { id: 'brush',   emoji: '🧴', target: 2, reward: 12, label: n => `לטפל ב-${n} שחקנים` },
  { id: 'collect', emoji: '💰', target: 2, reward: 18, label: n => `לאסוף הכנסות ${n} פעמים` },
  { id: 'solve',   emoji: '🔢', target: 10, reward: 20, label: n => `לפתור ${n} תרגילים` }
];

const Game = {
  coins: 40,
  xp: 0,
  level: 1,
  stars: 0,
  streak: 0,
  bestStreak: 0,
  solved: 0,
  settings: { age: 6, diff: 'normal', sound: true, voice: true, music: true, daynight: true },
  typeStats: {},     // {type: {c, w}} — דיוק לפי סוג תרגיל
  quests: [],        // משימות היום
  questDate: '',
  spinDate: '',      // תאריך הסיבוב האחרון בגלגל
  upgrades: {},      // שדרוגי אסם/חווה שנקנו {id:true}
  expansion: 0,      // רמת הרחבת-שטח החווה (0..3) — הגדר גדל והשדות מתרבים
  ribbons: 0,        // סרטים מתחרויות יופי
  rares: {},         // חיות נדירות שנפתחו {id:true}
  tree: null,        // עץ הקסם {planted, plantedAt, lastFruit}
  worldStats: { visited: {}, activities: {} },   // גילוי עולם: אילו אזורים בוקרו וכמה פעילויות בכל אחד
  _firstRun: true,

  // קושי גדל עם הגיל שנבחר ועם ההתקדמות במשחק
  ageBase() { return { 5: 1, 6: 3, 7: 5 }[this.settings.age] || 3; },
  // כוונון-קושי ידני מההגדרות: קל מוריד, מאתגר מעלה (מעל האוטומטי)
  diffOffset() { return { easy: -2, normal: 0, hard: 2 }[this.settings.diff] ?? 0; },
  difficulty() {
    const d = this.ageBase() + Math.floor(this.level / 2) + this.diffOffset();
    return Math.max(1, Math.min(12, d));
  },

  xpForNext() { return 100; },

  onCorrect() {
    this.solved++;
    this.streak++;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    this.xp += 10;
    this.coins += 5;
    let leveledUp = false;
    while (this.xp >= this.xpForNext()) {
      this.xp -= this.xpForNext();
      this.level++;
      this.stars++;
      leveledUp = true;
    }
    this.save();
    return { leveledUp };
  },

  // ללא עונש — לגיל 6 לא מאפסים את הרצף על טעות (משחק סלחני, בלי תחושת כישלון)
  onWrong() { },

  // --- קושי מותאם: דיוק לפי סוג תרגיל ---
  recordResult(type, correct) {
    if (!type) return;
    const s = this.typeStats[type] || (this.typeStats[type] = { c: 0, w: 0 });
    if (correct) s.c++; else s.w++;
  },
  weakType() {
    let worst = null, wr = 1;
    for (const t in this.typeStats) {
      const s = this.typeStats[t], n = s.c + s.w;
      if (n < 3) continue;
      const r = s.c / n;
      if (r < wr) { wr = r; worst = t; }
    }
    return wr < 0.75 ? worst : null;
  },

  // --- משימות יומיות ---
  ensureQuests(today) {
    if (this.questDate === today && this.quests.length) return;
    const pool = QUEST_POOL.slice(), picked = [];
    while (picked.length < 3 && pool.length) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    this.quests = picked.map(q => ({ id: q.id, emoji: q.emoji, target: q.target, reward: q.reward, text: q.label(q.target), progress: 0, done: false }));
    this.questDate = today; this.save();
  },
  bumpQuest(action) {
    const done = [];
    for (const q of this.quests) {
      if (q.done || q.id !== action) continue;
      q.progress++;
      if (q.progress >= q.target) { q.done = true; this.coins += q.reward; done.push(q); }
    }
    if (done.length) this.save();
    return done;
  },
  questsAllDone() { return this.quests.length > 0 && this.quests.every(q => q.done); },

  // --- גלגל מזל יומי ---
  canSpin(today) { return this.spinDate !== today; },
  doSpin(today) {
    this.spinDate = today;
    const prizes = [10, 15, 20, 25, 30, 15, 20, 25];
    const win = prizes[Math.floor(Math.random() * prizes.length)];
    this.coins += win; this.save();
    return win;
  },

  // --- גילוי עולם ---
  visitArea(id) {
    if (!this.worldStats.visited[id]) { this.worldStats.visited[id] = true; this.save(); }
  },
  recordActivity(id) {
    const a = this.worldStats.activities;
    a[id] = (a[id] || 0) + 1;
    let bonus = false;
    if (a[id] % 3 === 0) { this.stars += 1; bonus = true; }
    this.save();
    return bonus;
  },
  areaVisited(id) { return !!this.worldStats.visited[id]; },
  areaCount(id) { return this.worldStats.activities[id] || 0; },

  addCoins(n) { this.coins += n; this.save(); },
  canAfford(n) { return this.coins >= n; },
  spend(n) { if (this.coins < n) return false; this.coins -= n; this.save(); return true; },

  horseCost(owned) { return 25 + 15 * Math.max(0, owned - 1); },
  fieldCost(count) { return 20 + 12 * Math.max(0, count); },

  // --- הרחבת שטח החווה (בכסף) ---
  maxExpansion: 3,
  expansionCost() { return [70, 140, 240][this.expansion] || null; },   // null = הורחב למקסימום
  canExpandFarm() { return this.expansion < this.maxExpansion; },
  expandFarm() {                     // מגדיל רמת-הרחבה; המתקשר בונה מחדש גדר + שדות
    if (this.expansion >= this.maxExpansion) return false;
    this.expansion++; this.save();
    return true;
  },
  fenceRadius() { return 15 + this.expansion * 4; },       // רדיוס הגדר לפי רמת ההרחבה
  fieldCap() { return 9 + this.expansion * 3; },           // תקרת חלקות שדה לפי ההרחבה

  // מכירת יבול בקציר — מחזיר כמה מטבעות נוספו
  sellCrop(key) {
    const c = CROPS[key];
    const gain = c ? c.sellPrice : 8;
    this.coins += gain; this.save();
    return gain;
  },

  // snap = { horses, fields, placed } — נשמר בהדרגה
  save(snap) {
    try {
      if (snap) this._snap = Object.assign(this._snap || {}, snap);
      const s = this._snap || {};
      const data = {
        coins: this.coins, xp: this.xp, level: this.level, stars: this.stars,
        streak: this.streak, bestStreak: this.bestStreak, solved: this.solved,
        settings: this.settings,
        typeStats: this.typeStats, quests: this.quests, questDate: this.questDate, spinDate: this.spinDate,
        upgrades: this.upgrades, expansion: this.expansion, ribbons: this.ribbons, rares: this.rares, tree: this.tree, worldStats: this.worldStats, savedAt: Date.now(),
        horses: s.horses || [], fields: s.fields || [], placed: s.placed || [], animals: s.animals || []
      };
      this._lastData = data;     // לשימוש שמירת-הענן
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) { /* storage full / blocked */ }
  },

  lastData() { return this._lastData; },

  // החלת אובייקט-נתונים מלא (מ-localStorage או מהענן)
  applyData(d) {
    this.coins = d.coins ?? 40;
    this.xp = d.xp ?? 0;
    this.level = d.level ?? 1;
    this.stars = d.stars ?? 0;
    this.streak = d.streak ?? 0;
    this.bestStreak = d.bestStreak ?? 0;
    this.solved = d.solved ?? 0;
    this.settings = Object.assign({ age: 6, diff: 'normal', sound: true, voice: true, music: true, daynight: true }, d.settings || {});
    this.typeStats = d.typeStats || {};
    this.quests = d.quests || [];
    this.questDate = d.questDate || '';
    this.spinDate = d.spinDate || '';
    this.upgrades = d.upgrades || {};
    this.expansion = d.expansion || 0;
    this.ribbons = d.ribbons || 0;
    this.rares = d.rares || {};
    this.tree = d.tree || null;
    this.worldStats = d.worldStats || { visited: {}, activities: {} };
    this._snap = { horses: d.horses || [], fields: d.fields || [], placed: d.placed || [], animals: d.animals || [] };
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      this.applyData(d);
      this._firstRun = false;
      return d;
    } catch (e) { return null; }
  },

  reset() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    this.coins = 40; this.xp = 0; this.level = 1; this.stars = 0;
    this.streak = 0; this.bestStreak = 0; this.solved = 0;
    this.settings = { age: 6, diff: 'normal', sound: true, voice: true, music: true, daynight: true };
    this.typeStats = {}; this.quests = []; this.questDate = ''; this.spinDate = ''; this.upgrades = {}; this.expansion = 0;
    this.ribbons = 0; this.rares = {}; this.tree = null; this.worldStats = { visited: {}, activities: {} };
    this._firstRun = true; this._snap = { horses: [], fields: [], placed: [], animals: [] };
  }
};

export { Game, CROPS, SHOP };
