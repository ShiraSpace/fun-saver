/* node mockups/check.js — הבדיקות של תיקיית המוקאפים.
   1. כל עמוד סגור כמו שצריך, ואין CSS שדלף מחוץ ל-<style>
   2. כל קישור מקומי מצביע על קובץ קיים
   3. שני עמודי סיכום החשבון ממלאים את משבצותיהם, וה-JS המשותף שורד את החסרות
   4. contrast.html נפתח על מה שנבחר בפועל, וכל מד מקבל ערך במצב הזה */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const MOCKUPS = __dirname;
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr']);

const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return pages(full);
  return entry.name.endsWith('.html') ? [full] : [];
});

const ALL = pages(MOCKUPS).sort();
const rel = (file) => path.relative(MOCKUPS, file);
const lineAt = (html, index) => html.slice(0, index).split('\n').length;

/* ── 1. מבנה ────────────────────────────────────────────────────── */
function checkStructure(file) {
  const html = fs.readFileSync(file, 'utf8');
  const stack = [];

  for (const m of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, rawTag, attrs, selfClosed] = m;
    const tag = rawTag.toLowerCase();
    if (VOID.has(tag) || selfClosed || (attrs.endsWith('/') && !closing)) continue;

    if (closing) {
      const open = stack.pop();
      assert.ok(open, `${rel(file)}:${lineAt(html, m.index)} — </${tag}> בלי פתיחה`);
      assert.strictEqual(open.tag, tag,
        `${rel(file)}:${lineAt(html, m.index)} — </${tag}> סוגר <${open.tag}> שנפתח בשורה ${open.line}`);
    } else {
      stack.push({ tag, line: lineAt(html, m.index) });
    }
  }
  assert.strictEqual(stack.length, 0,
    `${rel(file)} — <${stack[0]?.tag}> בשורה ${stack[0]?.line} לא נסגר`);

  /* CSS שדלף מחוץ ל-<style> הוא HTML תקין, אבל נראה על המסך כטקסט */
  const body = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<template[\s\S]*?<\/template>/g, '')
    .replace(/<[^>]+>/g, '\n');
  for (const line of body.split('\n')) {
    assert.ok(!/^\s*[.#:@][\w\-[\]'"=.:# ]*\{/.test(line),
      `${rel(file)} — CSS מחוץ ל-<style>: ${line.trim().slice(0, 60)}`);
  }
}

/* ── 2. קישורים ─────────────────────────────────────────────────── */
function checkLinks(file) {
  const html = fs.readFileSync(file, 'utf8');
  let count = 0;
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#|data:|mailto:)/.test(ref)) continue;
    count++;
    assert.ok(fs.existsSync(path.resolve(path.dirname(file), ref)),
      `${rel(file)} — קישור שבור: ${ref}`);
  }
  return count;
}

/* ── 3. משבצות סיכום החשבון ─────────────────────────────────────── */
function checkAccountSummarySlots() {
  const SLOTS = {
    'transactions.html': ['iconControls', 'backControls', 'summaryPhone'],
    'menu.html': ['pencilControls', 'backControls', 'navCountControls', 'menuPhone',
      'menuPhoneGradient', 'menuPhoneAppHeader', 'menuPhoneNavBlock', 'menuPhoneNavBare',
      'menuPhoneNavTabs'],
  };
  const source = fs.readFileSync(path.join(MOCKUPS, 'account-summary/account-summary.js'), 'utf8');

  for (const [file, expected] of Object.entries(SLOTS)) {
    const html = fs.readFileSync(path.join(MOCKUPS, 'account-summary', file), 'utf8');
    for (const id of expected) {
      assert.ok(html.includes(`id="${id}"`), `${file} איבד את המשבצת ${id}`);
    }

    const slots = new Map(expected.map((id) => [id, { innerHTML: '' }]));
    const context = vm.createContext({
      document: {
        documentElement: { dataset: {} },
        getElementById: (id) => slots.get(id) ?? null,
        querySelectorAll: () => [],
        addEventListener: () => {},
      },
    });
    vm.runInContext(source, context);

    for (const [id, slot] of slots) {
      assert.ok(slot.innerHTML.length > 0, `${file}: ${id} נשארה ריקה`);
    }
    console.log(`ok   account-summary/${file} — ${expected.length} משבצות מלאות, ואין קריסה על החסרות`);
  }
}

/* ── 4. ברירת המחדל של עמוד הניגודיות ───────────────────────────── */
function checkContrastDefaults() {
  const ATTRIBUTE = { t: 'data-theme', v: 'data-variant', s: 'data-scrim', g: 'data-glow',
    b: 'data-bg', e: 'data-err', f: 'data-fade', x: 'data-save' };
  const html = fs.readFileSync(path.join(MOCKUPS, 'contrast.html'), 'utf8');

  const sections = [...html.matchAll(/<section class="pass (pass\d)"([^>]*)>([\s\S]*?)<\/section>/g)];
  assert.strictEqual(sections.length, 2, 'contrast.html — צריך בדיוק שני מחזורים');

  const rules = [...html.matchAll(/^(\.pass\d[^{]*)\{([^}]*)\}/gm)]
    .map(([, selector, declarations]) => ({ selector: selector.trim(), declarations }));

  for (const [, name, attrs, body] of sections) {
    const defaults = Object.fromEntries(
      [...attrs.matchAll(/(data-[a-z]+)="([^"]+)"/g)].map((m) => [m[1], m[2]]));

    const groups = [...body.matchAll(/<div class="grp">([\s\S]*?)<\/div>/g)].map((m) => m[1]);
    for (const group of groups) {
      const buttons = [...group.matchAll(/<button ([^>]*)>/g)].map((m) => m[1]);
      const pressed = buttons.filter((b) => b.includes('aria-pressed="true"'));
      assert.strictEqual(pressed.length, 1, `${name}: בכל קבוצה בדיוק כפתור אחד לחוץ`);

      const [, key, value] = pressed[0].match(/data-([a-z])="([^"]+)"/);
      assert.ok(ATTRIBUTE[key], `${name}: data-${key} לא ממופה לתכונה`);
      assert.strictEqual(defaults[ATTRIBUTE[key]], value,
        `${name}: ה-section פותח ב-${ATTRIBUTE[key]}="${defaults[ATTRIBUTE[key]]}" אבל לחוץ "${value}"`);

      const chosen = buttons.filter((b) => b.includes('data-chosen'));
      if (key === 't') {
        assert.strictEqual(chosen.length, 0,
          `${name}: הערכה היא ציר תצוגה — שלוש הערכות נשלחו, אין בה «נבחר»`);
        continue;
      }
      assert.strictEqual(chosen.length, 1, `${name}: בכל שאלה בדיוק אפשרות אחת נבחרה`);
      assert.strictEqual(chosen[0], pressed[0], `${name}: הכפתור הלחוץ הוא לא זה שנבחר`);
    }

    /* content עם var שאינו פתור לא מצויר כלל, והמד נשאר ריק */
    const activeAtOpen = (selector) => selector.split(',').some((part) =>
      part.includes(`.${name}`) && [...part.matchAll(/\[(data-[a-z]+)='([^']+)'\]/g)]
        .every(([, attribute, value]) => defaults[attribute] === value));

    const defined = new Set(rules.filter((r) => activeAtOpen(r.selector))
      .flatMap((r) => [...r.declarations.matchAll(/(--[\w-]+):/g)].map((m) => m[1])));

    const meters = [...html.matchAll(
      new RegExp(`\\.${name} \\.readout[.\\w]*::after \\{ content:[^}]*var\\((--[\\w-]+)\\)`, 'g'))];
    assert.ok(meters.length > 0, `${name}: לא נמצא אף מד`);
    for (const [, variable] of meters) {
      assert.ok(defined.has(variable),
        `${name}: ${variable} אינו מוגדר במצב הפתיחה — המד יישאר ריק`);
    }
    console.log(`ok   contrast.html · ${name} — ${groups.length} בוררים, ${meters.length} מדדים, ברירת המחדל היא מה שנבחר`);
  }
}

let links = 0;
for (const file of ALL) {
  checkStructure(file);
  links += checkLinks(file);
}
console.log(`ok   ${ALL.length} עמודים סגורים כראוי, בלי CSS שדלף`);
console.log(`ok   ${links} קישורים מקומיים, כולם מצביעים על קובץ קיים`);
checkAccountSummarySlots();
checkContrastDefaults();
