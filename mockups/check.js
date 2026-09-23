const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const MOCKUPS = __dirname;

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr']);

const TOGGLE_ATTRIBUTE = { t: 'data-theme', v: 'data-variant', s: 'data-scrim', g: 'data-glow',
  b: 'data-bg', e: 'data-err', f: 'data-fade', x: 'data-save' };

const ACCOUNT_SUMMARY_SLOTS = {
  'transactions.html': ['iconControls', 'backControls', 'summaryPhone'],
  'menu.html': ['pencilControls', 'backControls', 'navCountControls', 'menuPhone',
    'menuPhoneGradient', 'menuPhoneAppHeader', 'menuPhoneNavBlock', 'menuPhoneNavBare',
    'menuPhoneNavTabs'],
};

const htmlPagesUnder = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return htmlPagesUnder(full);
  return entry.name.endsWith('.html') ? [full] : [];
});

const shortName = (file) => path.relative(MOCKUPS, file);
const lineOf = (html, index) => html.slice(0, index).split('\n').length;

function assertEveryTagClosesInOrder(file, html) {
  const open = [];

  for (const match of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
    const [, isClosing, rawTag, attributes, selfClosed] = match;
    const tag = rawTag.toLowerCase();
    if (VOID_ELEMENTS.has(tag) || selfClosed || (attributes.endsWith('/') && !isClosing)) continue;

    const line = lineOf(html, match.index);
    if (!isClosing) {
      open.push({ tag, line });
      continue;
    }
    const innermost = open.pop();
    assert.ok(innermost, `${shortName(file)}:${line} — </${tag}> בלי פתיחה`);
    assert.strictEqual(innermost.tag, tag,
      `${shortName(file)}:${line} — </${tag}> סוגר <${innermost.tag}> שנפתח בשורה ${innermost.line}`);
  }

  assert.strictEqual(open.length, 0,
    `${shortName(file)} — <${open[0]?.tag}> בשורה ${open[0]?.line} לא נסגר`);
}

function assertNoStylesheetRendersAsVisibleText(file, html) {
  const visibleText = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<template[\s\S]*?<\/template>/g, '')
    .replace(/<[^>]+>/g, '\n');

  for (const line of visibleText.split('\n')) {
    assert.ok(!/^\s*[.#:@][\w\-[\]'"=.:# ]*\{/.test(line),
      `${shortName(file)} — CSS מחוץ ל-<style>, ולכן מצויר כטקסט: ${line.trim().slice(0, 60)}`);
  }
}

function countLocalLinksAndAssertEachResolves(file, html) {
  let local = 0;
  for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#|data:|mailto:)/.test(reference)) continue;
    local++;
    assert.ok(fs.existsSync(path.resolve(path.dirname(file), reference)),
      `${shortName(file)} — קישור שבור: ${reference}`);
  }
  return local;
}

function assertSharedScriptFillsPresentSlotsAndSurvivesAbsentOnes(file, declaredSlots) {
  const sharedScript = fs.readFileSync(
    path.join(MOCKUPS, 'account-summary/account-summary.js'), 'utf8');
  const html = fs.readFileSync(path.join(MOCKUPS, 'account-summary', file), 'utf8');

  for (const id of declaredSlots) {
    assert.ok(html.includes(`id="${id}"`), `${file} איבד את המשבצת ${id}`);
  }

  const slots = new Map(declaredSlots.map((id) => [id, { innerHTML: '' }]));
  const pageWithOnlyTheseSlots = vm.createContext({
    document: {
      documentElement: { dataset: {} },
      getElementById: (id) => slots.get(id) ?? null,
      querySelectorAll: () => [],
      addEventListener: () => {},
    },
  });
  vm.runInContext(sharedScript, pageWithOnlyTheseSlots);

  for (const [id, slot] of slots) {
    assert.ok(slot.innerHTML.length > 0, `${file}: ${id} נשארה ריקה`);
  }
}

function assertPressedButtonIsTheChosenOne(passName, group, openingState) {
  const buttons = [...group.matchAll(/<button ([^>]*)>/g)].map((match) => match[1]);
  const pressed = buttons.filter((button) => button.includes('aria-pressed="true"'));
  assert.strictEqual(pressed.length, 1, `${passName}: בכל קבוצה בדיוק כפתור אחד לחוץ`);

  const [, key, value] = pressed[0].match(/data-([a-z])="([^"]+)"/);
  const attribute = TOGGLE_ATTRIBUTE[key];
  assert.ok(attribute, `${passName}: data-${key} לא ממופה לתכונה`);
  assert.strictEqual(openingState[attribute], value,
    `${passName}: ה-section פותח ב-${attribute}="${openingState[attribute]}" אבל לחוץ "${value}"`);

  const chosen = buttons.filter((button) => button.includes('data-chosen'));
  if (key === 't') {
    assert.strictEqual(chosen.length, 0,
      `${passName}: הערכה היא ציר תצוגה — שלוש הערכות נשלחו, אין בה «נבחר»`);
    return;
  }
  assert.strictEqual(chosen.length, 1, `${passName}: בכל שאלה בדיוק אפשרות אחת נבחרה`);
  assert.strictEqual(chosen[0], pressed[0], `${passName}: הכפתור הלחוץ הוא לא זה שנבחר`);
}

function assertEveryMeterHasARatioInTheOpeningState(html, passName, openingState, rules) {
  const appliesInOpeningState = (selector) => selector.split(',').some((part) =>
    part.includes(`.${passName}`) && [...part.matchAll(/\[(data-[a-z]+)='([^']+)'\]/g)]
      .every(([, attribute, value]) => openingState[attribute] === value));

  const rulesInForce = rules.filter((rule) => appliesInOpeningState(rule.selector));
  const definedAtOpen = new Set(rulesInForce.flatMap((rule) =>
    [...rule.declarations.matchAll(/(--[\w-]+):/g)].map((match) => match[1])));

  const meters = [...html.matchAll(
    new RegExp(`\\.${passName} \\.readout[.\\w]*::after \\{ content:[^}]*var\\((--[\\w-]+)\\)`, 'g'))];
  assert.ok(meters.length > 0, `${passName}: לא נמצא אף מד`);

  for (const [, variable] of meters) {
    assert.ok(definedAtOpen.has(variable),
      `${passName}: ${variable} אינו מוגדר במצב הפתיחה — ה-content לא פתור והמד יישאר ריק`);
  }
  return meters.length;
}

function checkContrastOpensOnWhatWasChosen() {
  const html = fs.readFileSync(path.join(MOCKUPS, 'contrast.html'), 'utf8');
  const passes = [...html.matchAll(
    /<section class="pass (pass\d)"([^>]*)>([\s\S]*?)<\/section>/g)];
  assert.strictEqual(passes.length, 2, 'contrast.html — צריך בדיוק שני מחזורים');

  const rules = [...html.matchAll(/^(\.pass\d[^{]*)\{([^}]*)\}/gm)]
    .map(([, selector, declarations]) => ({ selector: selector.trim(), declarations }));

  for (const [, passName, attributes, body] of passes) {
    const openingState = Object.fromEntries([...attributes.matchAll(/(data-[a-z]+)="([^"]+)"/g)]
      .map((match) => [match[1], match[2]]));

    const groups = [...body.matchAll(/<div class="grp">([\s\S]*?)<\/div>/g)].map((match) => match[1]);
    for (const group of groups) {
      assertPressedButtonIsTheChosenOne(passName, group, openingState);
    }

    const meters = assertEveryMeterHasARatioInTheOpeningState(html, passName, openingState, rules);
    console.log(`ok   contrast.html · ${passName} — ${groups.length} בוררים, ${meters} מדדים, ברירת המחדל היא מה שנבחר`);
  }
}

const allPages = htmlPagesUnder(MOCKUPS).sort();
let localLinks = 0;

for (const file of allPages) {
  const html = fs.readFileSync(file, 'utf8');
  assertEveryTagClosesInOrder(file, html);
  assertNoStylesheetRendersAsVisibleText(file, html);
  localLinks += countLocalLinksAndAssertEachResolves(file, html);
}
console.log(`ok   ${allPages.length} עמודים סגורים כראוי, בלי CSS שדלף`);
console.log(`ok   ${localLinks} קישורים מקומיים, כולם מצביעים על קובץ קיים`);

for (const [file, declaredSlots] of Object.entries(ACCOUNT_SUMMARY_SLOTS)) {
  assertSharedScriptFillsPresentSlotsAndSurvivesAbsentOnes(file, declaredSlots);
  console.log(`ok   account-summary/${file} — ${declaredSlots.length} משבצות מלאות, ואין קריסה על החסרות`);
}

checkContrastOpensOnWhatWasChosen();
