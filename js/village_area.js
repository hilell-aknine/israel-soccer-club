// village_area.js — אזור "🏟️ תל אביב · בלומפילד" (מכבי ת"א, צהוב-כחול) בעולם הפתוח
// נבנה סביב deps.center (בערך (-72, 0)), עם רחבת אצטדיון חיה: מבנים, זרקורים, ספסלים,
// שלוש פעילויות מתמטיקה (מאמן, סקאוט, דוכן כרטיסים), קמעות מסתובבים ואווירה מונפשת.
// כל הקואורדינטות יחסיות למרכז: center.x+dx, center.z+dz.

// מפתח האנתם של מועדון הבית באזור זה — מנוע האודיו קורא לו בכניסה (playAnthem).
export const VILLAGE_ANTHEM = 'maccabitlv';

export function buildVillage(deps) {
  const { THREE, World, center } = deps;

  // אנתם מכבי ת"א מנוגן ע"י main בכניסה לאזור (travelToArea), לא בזמן הבנייה.

  // ───────────────────────────────────────────────
  // 1. רחבת האצטדיון — כתם דשא צהוב-חול רך + כתמים כהים קטנים לתחושת מרצפות רחבה
  // ───────────────────────────────────────────────
  World.floorPatch(center.x, center.z, 26, 22, 0xe8c84a);
  // כמה מרצפות כחולות פזורות (צבעי מכבי ת"א) כדי שהרחבה תיראה מרוצפת ולא שטוחה
  World.floorPatch(center.x - 5, center.z + 3, 6, 5, 0x1c4fa0);
  World.floorPatch(center.x + 6, center.z - 2, 5, 6, 0x1c4fa0);
  World.floorPatch(center.x + 2, center.z + 6, 5, 4, 0xd4b23e);

  // ───────────────────────────────────────────────
  // 2. ציון דרך מרכזי — המסך הענק בלב הרחבה
  // ───────────────────────────────────────────────
  const fountain = deps.decor('assets/big_screen.png', center.x, center.z - 1, 4);

  // ───────────────────────────────────────────────
  // 3. מתחם צפוף — מבני האצטדיון סביב הרחבה
  // ───────────────────────────────────────────────
  // חנות המועדון (משמאל-מאחור) — כאן עובד המאמן
  deps.decor('assets/clubshop.png', center.x - 7, center.z - 6, 7);
  // האצטדיון הראשי + שני דוכני שירות סביב הרחבה
  const roofCottage = deps.decor('assets/stadium.png', center.x + 8, center.z - 7, 6);
  deps.decor('assets/ticket_office.png', center.x + 10, center.z + 4, 6);
  deps.decor('assets/clubshop.png', center.x - 11, center.z + 2, 6);
  // מתקן מים לשחקנים ליד הדוכנים
  deps.decor('assets/water_bottle.png', center.x + 7, center.z + 8, 2.4, true);

  // זרקורי אצטדיון שמסמנים את שולי הרחבה (~4)
  deps.decor('assets/floodlight.png', center.x - 10, center.z - 2, 4);
  deps.decor('assets/floodlight.png', center.x - 3, center.z - 9, 4);
  deps.decor('assets/floodlight.png', center.x + 4, center.z - 9, 4);
  deps.decor('assets/floodlight.png', center.x + 11, center.z - 1, 4);

  // ספסלים לשבת (~3)
  deps.decor('assets/bench.png', center.x - 9, center.z + 6, 1.6);
  deps.decor('assets/bench.png', center.x + 3, center.z + 8, 1.6);
  deps.decor('assets/bench.png', center.x - 2, center.z + 6, 1.6);

  // דגלוני-אוהדים צבעוניים (~6)
  deps.decor('assets/pennant_flags.png', center.x - 4, center.z + 5, 1.2, true);
  deps.decor('assets/pennant_flags.png', center.x + 4, center.z - 4, 1.2, true);
  deps.decor('assets/pennant_flags.png', center.x - 8, center.z - 8, 1.2, true);
  deps.decor('assets/pennant_flags.png', center.x + 6, center.z + 5, 1.2, true);
  deps.decor('assets/pennant_flags.png', center.x - 6, center.z + 9, 1.2, true);
  deps.decor('assets/pennant_flags.png', center.x + 9, center.z + 1, 1.2, true);

  // עצים בשולי הכיכר (~5)
  deps.decor('assets/tree.png', center.x - 12, center.z + 9, 6, true);
  deps.decor('assets/tree.png', center.x + 12, center.z + 8, 6, true);
  deps.decor('assets/tree.png', center.x + 13, center.z - 8, 6, true);
  deps.decor('assets/tree.png', center.x - 13, center.z - 6, 6, true);
  deps.decor('assets/tree.png', center.x + 1, center.z - 12, 6, true);

  // סלעים קטנים פזורים
  deps.decor('assets/rock.png', center.x - 6, center.z + 9, 1.3, true);
  deps.decor('assets/rock.png', center.x + 6, center.z + 10, 1.3, true);
  deps.decor('assets/rock.png', center.x + 10, center.z - 4, 1.1, true);
  // קצת עשב לנוי
  deps.decor('assets/grass_tuft.png', center.x - 2, center.z + 8, 0.9);
  deps.decor('assets/grass_tuft.png', center.x + 1, center.z - 7, 0.9);
  // מעמד כדורים ליד הדוכן
  deps.decor('assets/ball_rack.png', center.x + 11, center.z + 6, 1.6, true);

  // תמרור הכוונה ושלט האצטדיון
  deps.decor('assets/signpost.png', center.x - 4, center.z + 11, 2.6, true);
  const sign = World.makeSign('🏟️ תל אביב · בלומפילד');
  sign.position.set(center.x, 0, center.z + 13);
  World.scene.add(sign);

  // ───────────────────────────────────────────────
  // עוזר קטן: סמן 💬/🛒 מרחף מעל ראש הדמות כדי שילדה תבין שאפשר ללחוץ
  // הריחוף עצמו מנוהל ב-onUpdate למטה (רשימת markers)
  // ───────────────────────────────────────────────
  const bobbers = []; // כל סמן שצריך לרחף עדין מעלה-מטה
  function addMarker(emoji, x, z, y) {
    const marker = World.emojiSprite(emoji, 1.2);
    marker.position.set(x, y, z);
    World.scene.add(marker);
    bobbers.push({ sprite: marker, baseY: y, phase: Math.random() * Math.PI * 2 });
    return marker;
  }

  // ───────────────────────────────────────────────
  // 4א. NPC המאמן — בוא נתאמן על בעיטות!
  // ───────────────────────────────────────────────
  const baker = deps.decor('assets/npc_coach.png', center.x - 7, center.z - 1, 4);
  function bake() {
    deps.Audio.speak('בוא נתאמן על בעיטות!');
    deps.askProblem('buy', res => {
      const g = 14 + deps.Game.level;
      deps.Game.coins += g;
      deps.spawnAt(center.x - 7, center.z - 1, 'star', 14);
      deps.Audio.coin();
      deps.UI.toast('⚽ סיימת אימון בעיטות! +' + g + ' 🪙', true);
      deps.grantReward({ x: center.x - 7, y: 2, z: center.z - 1 }, res);
      deps.saveAll();
    });
  }
  deps.activity(baker, () => bake());
  const bakerMarker = addMarker('💬', center.x - 7, center.z - 1, 4.6);
  deps.activity(bakerMarker, () => bake());

  // ───────────────────────────────────────────────
  // 4ב. NPC הסקאוט — בוא נסרוק אחרי כישרון חדש!
  // ───────────────────────────────────────────────
  const vet = deps.decor('assets/npc_scout.png', center.x + 5, center.z + 2, 4);
  function heal() {
    deps.Audio.speak('בוא נסרוק אחרי כישרון חדש!');
    deps.askProblem('brush', res => {
      const g = 12 + deps.Game.level;
      deps.Game.coins += g;
      deps.spawnAt(center.x + 5, center.z + 2, 'heart', 12);
      deps.Audio.coin();
      deps.UI.toast('🔍 גילית שחקן מוכשר! +' + g + ' 🪙', true);
      deps.grantReward({ x: center.x + 5, y: 2, z: center.z + 2 }, res);
      deps.saveAll();
    });
  }
  deps.activity(vet, () => heal());
  const vetMarker = addMarker('💬', center.x + 5, center.z + 2, 4.6);
  deps.activity(vetMarker, () => heal());

  // ───────────────────────────────────────────────
  // 4ג. דוכן הכרטיסים — מוכרים כרטיסים למשחק! (פעילות חדשה)
  // ───────────────────────────────────────────────
  const stall = deps.decor('assets/ticket_office.png', center.x - 1, center.z + 3, 2.4);
  function shop() {
    deps.Audio.speak('בוא נמכור כרטיסים למשחק!');
    deps.askProblem('buy', res => {
      const g = 13 + deps.Game.level;
      deps.Game.coins += g;
      deps.spawnAt(center.x - 1, center.z + 3, 'star', 13);
      deps.Audio.coin();
      deps.UI.toast('🎟️ מכרת כרטיסים למשחק! +' + g + ' 🪙', true);
      deps.grantReward({ x: center.x - 1, y: 2, z: center.z + 3 }, res);
      deps.saveAll();
    });
  }
  deps.activity(stall, () => shop());
  const stallMarker = addMarker('🛒', center.x - 1, center.z + 3, 3.0);
  deps.activity(stallMarker, () => shop());

  // ───────────────────────────────────────────────
  // 5. קמעות המועדון — ארבעה קמעות אוהדים שמסתובבים ברחבה
  // ───────────────────────────────────────────────
  const region = { x: center.x, z: center.z, r: 12 };
  deps.Animals.add({ type: 'cat', asset: 'mascot.png', scale: 1.0, region });
  deps.Animals.add({ type: 'dog', asset: 'mascot.png', scale: 1.2, region });
  deps.Animals.add({ type: 'chicken', asset: 'mascot.png', scale: 0.8, region });
  deps.Animals.add({ type: 'chicken', asset: 'mascot.png', scale: 0.8, region });

  // ───────────────────────────────────────────────
  // 6. אווירה מונפשת — עשן ארובה, ריחוף סמנים ונצנוץ מזרקה
  // ───────────────────────────────────────────────
  // עשן מהארובה: שני עננים אפורים שעולים מעל גג הבקתה ומתאפסים בלולאה
  const smokeBaseX = (roofCottage && roofCottage.position) ? roofCottage.position.x : center.x + 8;
  const smokeBaseZ = (roofCottage && roofCottage.position) ? roofCottage.position.z : center.z - 7;
  const smokeBaseY = 6.5; // מעל גג הבקתה
  const smokes = [];
  for (let i = 0; i < 2; i++) {
    const cloud = World.emojiSprite('☁️', 0.9);
    cloud.position.set(smokeBaseX, smokeBaseY, smokeBaseZ);
    World.scene.add(cloud);
    smokes.push({ sprite: cloud, offset: i * 1.6 }); // התחלה מדורגת בין שני העננים
  }

  // כדורגל שמרחף מעל המסך הענק ופועם בעדינות
  const droplet = World.emojiSprite('⚽', 0.7);
  const fx = (fountain && fountain.position) ? fountain.position.x : center.x;
  const fz = (fountain && fountain.position) ? fountain.position.z : center.z - 1;
  droplet.position.set(fx, 4.4, fz);
  World.scene.add(droplet);

  deps.onUpdate((t, dt) => {
    // ריחוף עדין של כל סמני הדמויות (💬 / 🛒)
    for (const b of bobbers) {
      b.sprite.position.y = b.baseY + Math.sin(t * 2.5 + b.phase) * 0.18;
    }

    // עשן ארובה — עולה למעלה ודוהה, ואז מתאפס לתחתית (לולאה של ~3.2 שניות)
    for (const s of smokes) {
      const cycle = 3.2;
      const phase = ((t + s.offset) % cycle) / cycle; // 0..1
      s.sprite.position.y = smokeBaseY + phase * 4.5; // עולה
      s.sprite.position.x = smokeBaseX + Math.sin(phase * 4) * 0.4; // נע קלות הצידה
      if (s.sprite.material) s.sprite.material.opacity = 0.7 * (1 - phase); // דוהה
    }

    // נצנוץ/פעימה של טיפת המזרקה
    droplet.position.y = 4.4 + Math.sin(t * 3.5) * 0.25;
    const pulse = 0.6 + Math.sin(t * 3.5) * 0.12;
    droplet.scale.set(pulse, pulse, pulse);
  });
}
