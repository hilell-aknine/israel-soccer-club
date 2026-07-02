# SKILL.md — מועדון הכדורגל (מסמך-העל)

> הזהות הדורסת של הפרויקט. לא סטטוס חי (זה ב-`primer.md` + `dashboard\PROJECTS_STATE.md`).
> משמש גם כ**מפרט הרה-סקין** לסוכני-הטורבו: נבנה כתאום של `agam-horse-farm`.

## מטרת-על · [Tier 4 — אישי/תחביב]
משחק **עולם-פתוח תלת-ממדי בסגנון FarmVille** לשני הבנים של הלל, בעברית מלאה **לשון זכר**.
**הקו-עלילה:** הילד הוא **בעל המועדון** — יושב באצטדיון שלו, **מאמן שחקנים, קונה מתקנים טובים יותר, חותם שחקנים מפורסמים מהעולם** (רונאלדו, מסי וכו'). מטפס בליגה עד גביע המדינה.
**כל פעולה דורשת תרגיל חשבון מותאם** — קושי עולה עם הרמה ומחזק את הסוג החלש. גישת "אי אפשר להפסיד": שחקן תמיד ממתין, אימון לא נגמר, טעות חושפת+מקריאה את התשובה (בלי מסך-כישלון).
**עולם חברתי:** שני מועדונים (אח לכל אח), אפשר לבקר את המועדון של האח (`?visit=<user_id>`, מצב צפייה בלבד).

## 4 הקבוצות = 4 ערים = 4 אזורי-עולם
כל בן מאמץ אחת כ**מועדון הבית**; השלוש האחרות = יריבות (נוסעים לעיר, דרבי, אוספים שחקנים/מדבקות).
| אזור | קבוצה | צבעים | אצטדיון | assets |
|---|---|---|---|---|
| ירושלים (מרכז-הר) | בית"ר | צהוב-שחור | טדי | `crest_beitar`, `player_yellowblack` |
| חיפה (צפון) | מכבי חיפה | ירוק-לבן | סמי עופר | `crest_maccabihaifa`, `player_greenwhite` |
| תל אביב (חוף) | מכבי ת"א | צהוב-כחול | בלומפילד | `crest_maccabitlv`, `player_yellowblue` |
| באר שבע (דרום) | הפועל ב"ש | אדום-לבן | טרנר | `crest_hapoelbs`, `player_redwhite` |

## מוזיקה — אנתם פר-מועדון (דרישת הלל 2026-07-02)
לכל אזור-מועדון **מנגינת-רקע ייחודית שמזוהה עם הקבוצה** — לא מוזיקה גנרית.
- **קופירייט:** אסור להשתמש בהקלטות האנתם האמיתיות (מוגן) באתר ציבורי. משתמשים ב**מוטיב מקורי** שתופס את *האופי* של הקבוצה (טמפו/סולם/מצב-רוח): בית"ר=מארש נמרץ מינורי-מזרחי; מכבי חיפה=אנתם ים-תיכוני מנצח בהיר; מכבי ת"א=אנתם קלאסי גאה; הפועל ב"ש=מארש דרומי אנרגטי.
- **מימוש:** מנוע האנתם ב-`audio.js` — `playAnthem(clubKey)` בכניסה לאזור; עוצר בעזיבה. שתי דרגות: (1) WebAudio פרוצדורלי פר-מועדון (חינם, מיידי) → (2) אופציונלי: לופ מקורי מיוצר (צריך מפתח מוזיקה + תקציב).

## Stack (זהה לחווה)
- **Vanilla JS (ES modules) + Three.js r160** מקומי (importmap, **בלי build**).
- **Supabase** — שמירת ענן + חשבונות (email). **PWA** (התקנה + אופליין). חשבון פרוצדורלי, הקראה (Web Speech), אודיו פרוצדורלי (WebAudio).
- אירוח סטטי (Vercel).

## מיקומים
- **מקומי:** `C:\Users\saraa\israel-soccer-club\` (נתיב ASCII — קריטי). הפעלה: `שחקי.bat` / `python -m http.server 8753`.
- **חי:** *(טרם נפרס — ממתין לסקירת הלל)* · **GitHub:** *(טרם)*.
- **סודות/מפתחות:** FAL ב-`.secrets\creative-board.env`; Supabase ב-`.secrets\agam-horse-farm.env` (**חולקים את הפרויקט של אגם**).
- `js/` מודולים · `assets/` (~56 ציורי FAL חדשים) · `css/style.css` · `tools/gen_soccer.py`.

## מודל נתונים — יושב על ה-Supabase של אגם (טבלאות נפרדות)
Ref `xgqetnlsesgwiypufodf` (חשבון hilelltohar@gmail.com), **אותם חשבונות email**.
- `soccer_saves(user_id uuid PK → auth.users, data jsonb, updated_at)` — מקביל ל-`game_saves`, מגירה נפרדת כדי לא לדרוס את החווה.
- `club_profiles(user_id PK, name, club, level, updated_at)` — שם מועדון + קבוצה + רמה, גלוי לביקורים.
- localStorage key: `soccer_club_v1` (לא `agam_farm_v2`).

## מפת הרה-סקין (חוזה לסוכנים — שומרים מפתחות/פונקציות זהים!)
**חוק-ברזל של הרה-סקין:** *כל שם export/פונקציה/מפתח-פנימי (CROP keys, SHOP ids, horse ids, area ids) נשאר זהה לחווה.* משנים רק: (א) מחרוזות-עברית → זכר+כדורגל, (ב) `name`/`icon`/`asset` בקטלוגים, (ג) קבצי-אמנות, (ד) ערכת-נושא ויזואלית של האזור. ככה אין התנגשות בין-קבצים.
| חווה | מועדון |
|---|---|
| `horses.js` — סוסים | **שחקנים** (אוסף+אימון). assets: `player_*`, `star_*` |
| `fields.js` / CROPS — גידולים | **אימונים** (מתפתחים לאורך זמן). assets: `drill_*` |
| `animals.js` — חיות מפיקות | **מתקנים מניבי-הכנסה** (חנות/כרטיסים). assets: `clubshop`, `ticket_office` |
| SHOP.decor — קישוט חווה | קישוט אצטדיון: `pennant_flags`, `big_screen`, `fan_drum`, `mascot`, `bench`, `lamp_post` |
| SHOP.equipment — ציוד | מתקני-אימון: `gym`, `medical`, `goal_net`, `drill_target`, `ball_rack`, `water_bottle` |
| SHOP.upgrades — שדרוגי אסם | שדרוגי אצטדיון: `stadium_big`, `floodlight`, `scoreboard`, `press_box` |
| `rares` — חיות נדירות | **כוכבי-על** נחתמים: `star_ronaldo/messi/neymar/mbappe/haaland/salah` |
| אזורים forest/lake/village/mountain | 4 ערי-אצטדיון (ירושלים/חיפה/ת"א/ב"ש) |
| `fair_area` — יריד | **טורניר / גביע המדינה** (`cup_state`, `trophy`, `medal`) |
| מיני: contest/delivery/photo | **פנדלים / אתגר-כישורים / יום-משחק** |
| NPC baker/vet | `npc_coach`, `npc_scout`, `npc_agent`, `npc_ref` |
| אסם/בית = `barn`,`cottage` | אצטדיון-הבית = `stadium`, `club_gate`, `dugout`, `bleachers` |
| מטבע `coin`, `gem`, כוכבים | ללא שינוי (מטבע=כסף מועדון, כוכבים=גביעים) |

## צנרת אמנות (tools/gen_soccer.py)
FAL: **Flux dev flat-vector sticker (guidance 4, 30 steps) → rembg cutout**. תקרת-עלות קשיחה $10 (~37₪), תקציב הלל 45₪. `--force` לרינדור-מחדש.

## חוקי-ברזל
1. **ילד, פשוט, בלי הפסד** — כפתורים ענקיים, הקראה, בלי עונש, שחקן/אימון תמיד ממתינים.
2. **כל פעולה = תרגיל מותאם** דרך `askProblem(actionType, onCorrect)`.
3. **עברית מלאה RTL לשון זכר**, אבל משוואות (3+2=?) חייבות LTR (`problem.ltr`).
4. **בלי build** — importmap ל-Three מקומי; supabase-js מ-esm.sh בזמן ריצה.
5. **ענן fail-safe** — תמיד נופל ל-localStorage.
6. **אזור/מיני-משחק = מודול נפרד** (deps) — טורבו-ידידותי.
7. **אנתם פר-מועדון** — לא מוזיקה גנרית.
8. אימות: `node --check js/*.js` + צילום headless + מבחן חשבון.

## גוטצ'ות (ראה hindsight.md — יורש מהחווה)
`p.rotation` על Sprite זורק · Supabase Mgmt API חוסם python-UA (צריך User-Agent: Mozilla) · far-plane<sky=שמיים שחורים · headless virtual-time לא מריץ אנימציית-נסיעה.
