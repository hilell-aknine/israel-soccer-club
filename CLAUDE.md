# CLAUDE.md — מועדון הכדורגל (חוקי הרצה מקומיים)

**[Tier 4 — אישי/תחביב]** · מוח-העל: `SKILL.md` · סטטוס חי: `primer.md` + `dashboard\PROJECTS_STATE.md`.

## Startup
1. קרא `SKILL.md` (זהות) + `primer.md` (איפה אנחנו) + `hindsight.md` (גוטצ'ות).
2. אם ריצה/צילום צריך — הפעל שרת מקומי: `python -m http.server 8753` (חובה http, לא file:// בגלל ES modules).

## ארכיטקטורה
- Vanilla JS + Three.js מקומי (importmap) — **אין שלב build, אין npm run**. עורכים קובץ → מרעננים דפדפן.
- כל שינוי קוד: `node --check js/<file>.js` לפני. אימות ויזואלי: Chrome headless (`--headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --screenshot`).
- מודולים דיסיוינטיים (אזורים/מיני-משחקים) — מושלם לפיצול טורבו. שכבות חוצות-מערכת (state/HUD/save) — לבנות ישירות (טורבו יוצר התנגשויות).

## פריסה
- `git push origin main` → **Vercel בונה מחדש אוטומטית** (חובר דרך GitHub). אין Vercel CLI.
- לפני push: `node --check` על כל הקבצים + טעינת-headless ללא שגיאות קונסול.
- קומיט מסיים ב-Co-Authored-By + Claude-Session (פרוטוקול git).

## Supabase
- מפתחות ב-`.secrets\agam-horse-farm.env`. anon key **ציבורי-בטוח** בצד-לקוח (מוגן RLS).
- Management API (יצירת טבלה/הפעלת auth): חובה header `User-Agent: Mozilla/...` אחרת Cloudflare מחזיר 403/1010.

## חוקי תוכן
- הכל עברית, **לשון זכר** (פונים לבנים). כפתורים גדולים, הקראה קולית, בלי מסכי-כישלון.
- כל פעולה עוברת דרך `askProblem` (קושי מותאם + מעקב פעילות). משוואות LTR.
- **אנתם פר-מועדון** (לא מוזיקה גנרית) — ראה SKILL.md. אסור הקלטות אנתם אמיתיות (קופירייט); מוטיב מקורי בלבד.
- אמנות חדשה: `tools/gen_soccer.py` (Flux flat-vector + rembg). תקציב הלל **45₪** (תקרה קשיחה $10 בסקריפט).
- **הרה-סקין:** שומרים כל מפתח-פנימי/שם-פונקציה זהה לחווה; משנים רק תוויות-עברית + דאטה + assets (ראה מפת הרה-סקין ב-SKILL.md).

## מה לא לשבור
- נתיב ASCII (לא להעביר לתיקייה עברית — שובר ריצה/spawn).
- `preserveDrawingBuffer:true` על ה-renderer (נחוץ לצילום).
- far-plane מצלמה (400) חייב להיות > רדיוס-שמיים (200).
