// mountain_area.js — אזור "🏟️ באר שבע · טרנר" (הפועל ב"ש, אדום-לבן): גבעת מדבר, מנהרת שחקנים,
// סלעים, אימוני בעיטות וקמעות. חלק מהעולם הפתוח. נבנה סביב deps.center הרחק מהמרכז.
// נפתח ברמה גבוהה יותר, ולכן הפרס על אימון גדול יותר.

// מפתח האנתם של מועדון הבית באזור זה — מנוע האודיו קורא לו בכניסה (playAnthem).
export const MOUNTAIN_ANTHEM = 'hapoelbs';

export function buildMountain(deps) {
  const { THREE, World, center } = deps;
  const cx = center.x, cz = center.z;

  // אנתם הפועל ב"ש מנוגן ע"י main בכניסה לאזור (travelToArea), לא בזמן הבנייה.

  // עוזר קטן: מספר אקראי בטווח
  const rand = (min, max) => min + Math.random() * (max - min);

  // ===== 1) קרקע: טלאי חול-מדבר דרומי + שני טלאי לבן (צבע הפועל ב"ש) =====
  World.floorPatch(cx, cz, 28, 24, 0xc9a26a);              // קרקע המדבר החולית
  World.floorPatch(cx - 6, cz - 12, 10, 8, 0xffffff);      // טלאי לבן ליד הגבעה
  World.floorPatch(cx + 7, cz - 9, 7, 6, 0xf6f6f6);        // עוד טלאי לבן קטן

  // ===== 2) גבעת סלע אדומה מאחורי המנהרה: חרוט סלע אדום + כובע לבן למעלה (אדום-לבן) =====
  // חרוט הסלע הגדול
  const peakGeo = new THREE.ConeGeometry(9, 18, 7);
  const peakMat = new THREE.MeshStandardMaterial({ color: 0xb0433a, flatShading: true });
  const peak = new THREE.Mesh(peakGeo, peakMat);
  peak.position.set(cx, 9, cz - 14);                       // הבסיס על הקרקע, הקודקוד בגובה ~18
  peak.castShadow = true;
  World.scene.add(peak);

  // כובע לבן על הקודקוד (צבע הפועל ב"ש)
  const capGeo = new THREE.ConeGeometry(3.6, 6, 7);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.set(cx, 16.5, cz - 14);
  World.scene.add(cap);

  // מנהרת השחקנים הגדולה בבסיס הגבעה
  deps.decor('assets/dugout.png', cx, cz - 7, 9);

  // ===== 3) סלעים, עצים ושיחים צפופים — מרגיש כמו בסיס הר אמיתי =====
  // עוזר: פיזור קישוט בטבעת סביב בסיס ההר
  function ringDecor(url, height, withShadow, rMin, rMax) {
    const ang = rand(0, Math.PI * 2);
    const r = rand(rMin, rMax);
    const x = cx + Math.cos(ang) * r;
    const z = cz + Math.sin(ang) * r;
    return deps.decor(url, x, z, height, withShadow);
  }

  // ~12 סלעים בגבהים מגוונים (1.5..4)
  for (let i = 0; i < 12; i++) ringDecor('assets/rock.png', rand(1.5, 4.0), true, 6, 17);
  // ~5 עצי אורן
  for (let i = 0; i < 5; i++) ringDecor('assets/pine_tree.png', rand(3.0, 4.5), true, 9, 17);
  // עץ אלון אחד גדול לגיוון
  ringDecor('assets/oak_tree.png', 4.6, true, 11, 16);
  // כמה שיחים וצרורות עשב מסביב לקצוות
  for (let i = 0; i < 4; i++) ringDecor('assets/bush.png', rand(1.0, 1.6), true, 7, 16);
  for (let i = 0; i < 4; i++) ringDecor('assets/grass_tuft.png', rand(0.8, 1.3), false, 6, 16);

  // שלט "באר שבע · טרנר" בקצה הקדמי של האזור
  const sign = World.makeSign('🏟️ באר שבע · טרנר');
  sign.position.set(cx, 0, cz + 14);
  World.scene.add(sign);

  // ===== 4א) אימון בעיטות — פעילות ראשונה (נשמרה): פותחת בעיית חשבון =====
  function mine(x, z) {
    deps.Audio.speak('מתאמנים על בעיטות חופשיות!');
    deps.askProblem('harvest', res => {
      const gain = 18 + deps.Game.level * 2;
      deps.Game.coins += gain;
      deps.spawnAt(x, z, 'star', 16);
      deps.Audio.coin();
      deps.Audio.fanfare();
      deps.UI.toast('⚽ הבקעת מהאימון! +' + gain + ' 🪙', true);
      deps.grantReward({ x, y: 2, z }, res);
      deps.saveAll();
    });
  }

  // שלוש נקודות אימון לחיצות, עם סמן ✨ שמרחף מעליהן (נשמר לסימון ✨ פולסים)
  const sparkles = [];   // נשמור את הסמנים כדי לפעם אותם ב-onUpdate
  const gems = [
    { x: cx - 6, z: cz - 2 },
    { x: cx + 5, z: cz + 1 },
    { x: cx + 1, z: cz - 5 },
  ];
  for (const p of gems) {
    // מטרת האימון עצמה — סְפְרייט לחיץ
    const g = deps.decor('assets/drill_target.png', p.x, p.z, 1.8, false);

    // סמן ✨ קטן שמרחף מעל מטרת האימון
    const marker = World.emojiSprite('✨', 1.0);
    marker.center.set(0.5, 0.0);            // עיגון מרכז-תחתון
    marker.position.set(p.x, 2.4, p.z);
    World.scene.add(marker);
    sparkles.push({ s: marker, baseY: 2.4, phase: rand(0, Math.PI * 2) });

    // רישום מטרת האימון כפעילות לחיצה
    deps.activity(g, () => mine(p.x, p.z));
  }

  // ===== 4ב) פעילות חדשה: כניסה למנהרת השחקנים → יציאה לניצחון =====
  const caveSprite = deps.decor('assets/dugout.png', cx, cz - 7, 9);  // ספרייט לחיץ למנהרה
  deps.activity(caveSprite, () => {
    deps.Audio.speak('נכנסים למנהרת השחקנים!');
    deps.askProblem('harvest', res => {
      const gain = 25 + deps.Game.level * 2;
      deps.Game.coins += gain;
      deps.spawnAt(cx, cz - 7, 'star', 18);
      deps.Audio.coin();
      deps.Audio.fanfare();
      deps.UI.toast('🏆 יצאת מהמנהרה עם ניצחון! +' + gain + ' 🪙', true);
      deps.grantReward({ x: cx, y: 2, z: cz - 7 }, res);
      deps.saveAll();
    });
  });

  // ===== 5) קמעות מועדון משוטטים: שלושה קמעות אוהדים =====
  const region = { x: cx, z: cz, r: 12 };
  deps.Animals.add({ type: 'penguin', asset: 'mascot.png', scale: 1.0, region });
  deps.Animals.add({ type: 'penguin', asset: 'mascot.png', scale: 0.9, region });
  deps.Animals.add({ type: 'sheep',   asset: 'mascot.png',   scale: 1.0, region });

  // ===== 6) אווירה חיה (onUpdate): נשר חג מעל ההר + פולס לסמני ה-✨ + סלע מרחף קטן =====
  // נשר שעף במעגל איטי מעל הפסגה
  const eagle = World.emojiSprite('🦅', 1.6);
  eagle.position.set(cx, 16, cz);
  World.scene.add(eagle);

  // סלע קטן ומרחף עדין מעל אחת מאבני החן (קישוט עדין)
  const floatRock = deps.decor('assets/rock.png', cx + 3, cz - 3, 0.9, false);
  const floatBaseY = (floatRock && floatRock.position) ? floatRock.position.y : 0.9;

  deps.onUpdate((t, dt) => {
    // נשר חג במעגל איטי, גובה ~16
    const er = 10;
    eagle.position.x = cx + Math.cos(t * 0.4) * er;
    eagle.position.z = cz + Math.sin(t * 0.4) * er;
    eagle.position.y = 16 + Math.sin(t * 0.8) * 0.6;

    // פולס עדין לסמני ה-✨: ריחוף מעלה-מטה + שינוי גודל קל
    for (const sp of sparkles) {
      sp.s.position.y = sp.baseY + Math.sin(t * 3 + sp.phase) * 0.25;
      const pulse = 1.0 + Math.sin(t * 4 + sp.phase) * 0.12;
      sp.s.scale.set(pulse, pulse, 1);
    }

    // סלע מרחף קטן ועדין
    if (floatRock && floatRock.position) {
      floatRock.position.y = floatBaseY + Math.sin(t * 1.5) * 0.18;
    }
  });
}
