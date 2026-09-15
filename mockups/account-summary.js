/* fun-saver — מוקאפ אינטראקטיבי למסך סיכום חשבון.
   כל הסכומים באגורות (כמו בקוד); ההמרה לשקלים נעשית רק בתצוגה. */

const DAYS = 430;                             /* ~14 חודשי היסטוריה, כדי ש'שנה' ו'הכל' יהיו שונים */
const DAILY_RATE = 0.15 / 30;                 /* dailyRate(SAVINGS_MONTHLY_RATE) */
const SPLIT = { savings: 0.4, spending: 0.5, good: 0.1 };   /* DEPOSIT_SPLIT */
const TODAY = Date.UTC(2026, 8, 14);

const WALLETS = [
  { key: 'savings',  name: 'חיסכון',      short: 'חיסכון',  icon: '🐷', color: 'var(--arcSavings)'  },
  { key: 'spending', name: 'בזבוזים',     short: 'בזבוזים', icon: '🛍️', color: 'var(--arcSpending)' },
  { key: 'good',     name: 'מעשים טובים', short: 'מעשים',   icon: '💛', color: 'var(--arcGood)'     },
];
const TOTAL_KEY = { key: 'total', name: 'סך הכל', short: 'סך הכל', color: 'var(--textStrong)' };

const ACCOUNTS = [
  { id: 'eli', name: 'אלי', avatar: '🧒', theme: 'jungle-quest',
    start: { savings: 1800, spending: 2100, good: 1400 },
    allowance: 2000, every: 14, offset: 3,
    buy: 1200, buyEvery: 19, buyOffset: 7,
    donate: 300, donateEvery: 45, donateOffset: 12 },
  { id: 'noa', name: 'נועה', avatar: '👧', theme: 'sunshine-quest',
    start: { savings: 2600, spending: 4300, good: 1500 },
    allowance: 2500, every: 7, offset: 1,
    buy: 2600, buyEvery: 11, buyOffset: 4,
    donate: 700, donateEvery: 20, donateOffset: 9 },
  { id: 'itay', name: 'איתי', avatar: '👦', theme: 'midnight-blue',
    start: { savings: 900, spending: 800, good: 300 },
    allowance: 1000, every: 21, offset: 5,
    buy: 600, buyEvery: 29, buyOffset: 11,
    donate: 200, donateEvery: 60, donateOffset: 20 },
];

/* ---------------- series ---------------- */

function eventFor(account, day) {
  const hits = (every, offset) => day >= offset && (day - offset) % every === 0;

  if (hits(account.every, account.offset)) {
    return { kind: 'deposit', total: account.allowance };
  }
  if (hits(account.buyEvery, account.buyOffset)) {
    return { kind: 'buy', wallet: 'spending', amount: account.buy };
  }
  if (hits(account.donateEvery, account.donateOffset)) {
    return { kind: 'donate', wallet: 'good', amount: account.donate };
  }
  return null;
}

function buildSeries(account) {
  const series = { savings: [], spending: [], good: [], total: [], interest: [], events: new Map() };
  const balance = { ...account.start };

  for (let day = 0; day <= DAYS; day++) {
    let gained = 0;

    if (day > 0) {
      gained = Math.round(balance.savings * DAILY_RATE);
      balance.savings += gained;

      const event = eventFor(account, day);
      if (event && event.kind === 'deposit') {
        /* splitDeposit: spending ו-goodDeeds מעוגלים למטה, החיסכון מקבל את השארית */
        const spending = Math.floor(event.total * SPLIT.spending);
        const good = Math.floor(event.total * SPLIT.good);
        const savings = event.total - spending - good;
        balance.savings += savings;
        balance.spending += spending;
        balance.good += good;
        series.events.set(day, { ...event, savings, spending, good });
      } else if (event && balance[event.wallet] >= event.amount) {
        /* overdraft protection — same rule as addWithdrawal */
        balance[event.wallet] -= event.amount;
        series.events.set(day, event);
      }
    }

    series.interest.push(gained);
    for (const wallet of WALLETS) {
      series[wallet.key].push(balance[wallet.key]);
    }
    series.total.push(balance.savings + balance.spending + balance.good);
  }

  return series;
}

const SERIES = new Map(ACCOUNTS.map((account) => [account.id, buildSeries(account)]));
const THEME_BY_ACCOUNT = new Map(ACCOUNTS.map((account) => [account.id, account.theme]));

/* ---------------- state ---------------- */

const state = {
  accountId: 'eli',
  range: 30,
  showTotal: true,
  wallets: new Set(),
  interestMode: 'monthly',
  iconStyle: 'split',
  pencilStyle: 'under',
  typeFilter: 'all',
  menuOpen: true,
  accountListOpen: false,
  rtlAxis: true,
};

const account = () => ACCOUNTS.find((candidate) => candidate.id === state.accountId);
const series = () => SERIES.get(state.accountId);

/* ---------------- formatting ---------------- */

const MONTHS = ['בינואר', 'בפברואר', 'במרץ', 'באפריל', 'במאי', 'ביוני', 'ביולי',
  'באוגוסט', 'בספטמבר', 'באוקטובר', 'בנובמבר', 'בדצמבר'];
const MONTH_NAMES = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי',
  'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

function dateOf(day) {
  return new Date(TODAY - (DAYS - day) * 86400000);
}
function dayLabel(day) {
  const date = dateOf(day);
  return date.getUTCDate() + ' ' + MONTHS[date.getUTCMonth()];
}
function monthKey(day) {
  const date = dateOf(day);
  return date.getUTCFullYear() + '-' + date.getUTCMonth();
}
function monthLabel(day) {
  return MONTH_NAMES[dateOf(day).getUTCMonth()];
}
/* השנה מוצגת רק כשהיא אינה השנה הנוכחית */
function monthHeadLabel(day) {
  const date = dateOf(day);
  const year = date.getUTCFullYear();
  const currentYear = new Date(TODAY).getUTCFullYear();
  return monthLabel(day) + (year === currentYear ? '' : ' ' + year);
}
const MONTH_SHORT = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
function shortDate(day) {
  const date = dateOf(day);
  return date.getUTCDate() + '.' + (date.getUTCMonth() + 1);
}
function shortMonth(day, withYear) {
  const date = dateOf(day);
  const name = MONTH_SHORT[date.getUTCMonth()];
  return withYear ? name + ' ' + String(date.getUTCFullYear()).slice(2) : name;
}

/* יתרות בשקלים שלמים; סכומי תנועה עד שתי ספרות אחרי הנקודה */
function shekels(agorot) {
  return '₪' + Math.round(agorot / 100);
}
/* מתחת ל-₪10 מציגים אגורות (כדי שריבית יומית לא תיעלם), מעל זה שקלים שלמים כמו היתרות */
const DECIMALS_BELOW_AGOROT = 1000;
function amount(agorot) {
  const abs = Math.abs(agorot);
  const text = abs >= DECIMALS_BELOW_AGOROT || abs % 100 === 0
    ? String(Math.round(abs / 100))
    : (abs / 100).toFixed(2);
  return (agorot < 0 ? '-' : '+') + '₪' + text;
}
/* הכותרת הגדולה נשארת בשקלים שלמים כמו בשאר האפליקציה */
function wholeShekelDelta(agorot) {
  return (agorot < 0 ? '-' : '+') + '₪' + Math.abs(Math.round(agorot / 100));
}

/* ---------------- chart ---------------- */

const W = 332;
const H = 112;
/* near = הקצה של "היום"; far = הקצה שבו יושבות תוויות ציר ה-Y */
const PAD = { t: 12, b: 17, near: 6, far: 38 };
const LABEL_GAP = 11;
const Y_TICKS = 3;
const TICK_EDGE = 16;
/* המסמך כולו dir="rtl", ולכן text-anchor הפוך ממה שנראה אינטואיטיבי:
   'end' מציב את הטקסט מימין ל-x, ו-'start' משמאל לו. */
const ANCHOR_RIGHTWARD = 'end';
const ANCHOR_LEFTWARD = 'start';

function windowStart() {
  return Math.max(0, DAYS - state.range);
}
function nearX() {
  return state.rtlAxis ? PAD.near : W - PAD.near;
}
function farX() {
  return state.rtlAxis ? W - PAD.far : PAD.far;
}
function plotLeft() {
  return Math.min(nearX(), farX());
}
function plotRight() {
  return Math.max(nearX(), farX());
}
function xAt(day) {
  const from = windowStart();
  const span = DAYS - from || 1;
  const progress = (day - from) / span;
  return farX() + (nearX() - farX()) * progress;
}
function shownKeys() {
  const keys = WALLETS.filter((wallet) => state.wallets.has(wallet.key));
  return state.showTotal ? [TOTAL_KEY, ...keys] : keys;
}
function extentOf(keys) {
  const from = windowStart();
  const values = keys.flatMap((key) => series()[key.key].slice(from));
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, span: max - min || 1 };
}
function scaleY(keys) {
  const { min, span } = extentOf(keys);
  return (value) => H - PAD.b - ((value - min) / span) * (H - PAD.t - PAD.b);
}
function linePath(key, y) {
  const from = windowStart();
  return series()[key.key]
    .slice(from)
    .map((value, index) => (index ? 'L' : 'M') + xAt(from + index).toFixed(1) + ' ' + y(value).toFixed(1))
    .join(' ');
}
function directLabels(keys, y) {
  const x = nearX() + (state.rtlAxis ? 5 : -5);
  const anchor = state.rtlAxis ? ANCHOR_RIGHTWARD : ANCHOR_LEFTWARD;
  const placed = keys
    .map((key) => ({ key, want: y(series()[key.key][DAYS]) }))
    .sort((a, b) => a.want - b.want);

  let floor = PAD.t;
  for (const entry of placed) {
    entry.at = Math.max(entry.want, floor);
    floor = entry.at + LABEL_GAP;
  }
  const overflow = floor - LABEL_GAP - (H - PAD.b);
  if (overflow > 0) {
    for (const entry of placed) {
      entry.at -= overflow;
    }
  }

  return placed
    .map(({ key, at }) => `<text x="${x.toFixed(1)}" y="${(at + 3.5).toFixed(1)}" text-anchor="${anchor}"
      fill="${key.color}">${key.short} ${shekels(series()[key.key][DAYS])}</text>`)
    .join('');
}
/* ציר Y עם מספרים, בקצה הרחוק — בעברית זה הצד הימני */
function yAxisHtml(y, keys) {
  const { min, max } = extentOf(keys);
  const x = state.rtlAxis ? W - PAD.far + 5 : PAD.far - 5;
  const anchor = state.rtlAxis ? ANCHOR_RIGHTWARD : ANCHOR_LEFTWARD;

  return Array.from({ length: Y_TICKS }, (unused, index) => {
    const value = min + ((max - min) * index) / (Y_TICKS - 1);
    const at = y(value);
    return `<line class="grid" x1="${plotLeft()}" x2="${plotRight()}" y1="${at.toFixed(1)}" y2="${at.toFixed(1)}" />
      <text class="axis" x="${x}" y="${(at + 3).toFixed(1)}" text-anchor="${anchor}">${shekels(value)}</text>`;
  }).join('');
}
/* כמה תאריכים על ציר ה-X, בגרנולריות שמתאימה לטווח */
function axisTicks() {
  const from = windowStart();
  const span = DAYS - from;
  const count = span <= 7 ? 4 : span <= 45 ? 5 : 6;
  const byMonth = span > 120;
  const ticks = [];

  for (let index = 0; index < count; index++) {
    const day = Math.round(from + (span * index) / (count - 1));
    ticks.push({
      day,
      text: index === count - 1 ? 'היום' : byMonth ? shortMonth(day, span > 300) : shortDate(day),
    });
  }

  return ticks;
}
function axisHtml() {
  return axisTicks()
    .map(({ day, text }) => {
      const x = Math.min(Math.max(xAt(day), plotLeft() + TICK_EDGE), plotRight() - TICK_EDGE);
      return `<text class="axis" x="${x.toFixed(1)}" y="${H - 3}" text-anchor="middle">${text}</text>`;
    })
    .join('');
}
function chartSvg() {
  const keys = shownKeys();

  if (keys.length === 0) {
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="לא נבחר קו להצגה">
      <text class="empty" x="${W / 2}" y="${H / 2}" text-anchor="middle">בחרו קו אחד לפחות להצגה</text></svg>`;
  }

  const y = scaleY(keys);
  const from = windowStart();
  const base = (H - PAD.b).toFixed(1);
  const totalShown = keys.some((key) => key.key === 'total');
  const walletKeys = keys.filter((key) => key.key !== 'total');
  const fill = totalShown
    ? `<path class="fill" d="${linePath(TOTAL_KEY, y)} L ${xAt(DAYS).toFixed(1)} ${base} L ${xAt(from).toFixed(1)} ${base} Z" />`
    : '';

  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="מאזן לאורך זמן">
    ${yAxisHtml(y, keys)}
    ${fill}
    ${walletKeys.map((key) => `<path class="line ${key.key}" d="${linePath(key, y)}" />`).join('')}
    ${totalShown ? `<path class="line total" d="${linePath(TOTAL_KEY, y)}" />` : ''}
    ${directLabels(keys, y)}
    ${axisHtml()}
  </svg>`;
}

/* ---------------- transactions ---------------- */

/* typeIcon = מה קרה, walletIcon = לאיזו קופה.
   להפקדה אין קופה אחת — היא מתחלקת לשלוש — ולכן היא מקבלת אייקון בודד. */
const EVENT_LOOK = {
  deposit: { typeIcon: '💰', walletIcon: null, cls: '', name: 'הפקדה' },
  buy:     { typeIcon: '🛒', walletIcon: '🛍️', cls: 'spending', name: 'קנייה', meta: '' },
  donate:  { typeIcon: '🎁', walletIcon: '💛', cls: 'good', name: 'תרומה', meta: '' },
};

const PENCIL_STYLES = [
  { id: 'under', label: 'טקסט מתחת לבורר' },
  { id: 'inList', label: 'בתוך הרשימה הפתוחה' },
];

const ICON_STYLES = [
  { id: 'split', label: 'חצי־חצי' },
  { id: 'badge', label: 'תג בפינה' },
  { id: 'duo', label: 'שני עיגולים' },
];

function iconHtml(row) {
  if (!row.walletIcon) {
    return `<span class="ic ${row.cls}">${row.typeIcon}</span>`;
  }
  if (state.iconStyle === 'badge') {
    return `<span class="ic ${row.cls} badged">${row.walletIcon}
      <span class="tag">${row.typeIcon}</span></span>`;
  }
  if (state.iconStyle === 'duo') {
    return `<span class="ic duo"><span class="d1 ${row.cls}">${row.walletIcon}</span>
      <span class="d2">${row.typeIcon}</span></span>`;
  }
  /* כל חצי חושף מחצית אחרת של אמוג'י שלם — חיתוך אנכי במרכז */
  return `<span class="ic split">
    <span class="f fL ${row.cls}"><span>${row.walletIcon}</span></span>
    <span class="f fR"><span>${row.typeIcon}</span></span></span>`;
}

const TYPE_FILTERS = [
  { id: 'all', label: 'הכל' },
  { id: 'deposit', label: 'הפקדות' },
  { id: 'withdrawal', label: 'משיכות' },
  { id: 'interest', label: 'ריבית' },
];

function eventRows() {
  const rows = [];

  for (const [day, event] of series().events) {
    const look = EVENT_LOOK[event.kind];
    const signed = event.kind === 'deposit' ? event.total : -event.amount;
    rows.push({
      day, group: 'withdrawal', typeIcon: look.typeIcon, walletIcon: look.walletIcon,
      cls: look.cls, name: look.name, meta: dayLabel(day),
      value: signed, balance: series().total[day], interest: false,
    });
    if (event.kind === 'deposit') {
      rows[rows.length - 1].group = 'deposit';
    }
  }

  return rows;
}

function dailyInterestRows() {
  const rows = [];

  for (let day = 1; day <= DAYS; day++) {
    const gained = series().interest[day];
    if (gained <= 0) {
      continue;
    }
    const event = series().events.get(day);
    const spent = event ? (event.kind === 'deposit' ? event.total : -event.amount) : 0;
    rows.push({
      day, group: 'interest', typeIcon: '✨', walletIcon: '🐷', cls: 'savings',
      name: 'ריבית', meta: dayLabel(day),
      value: gained, balance: series().total[day] - spent, interest: true,
    });
  }

  return rows;
}

function monthlyInterestRows() {
  const byMonth = new Map();

  for (let day = 1; day <= DAYS; day++) {
    const gained = series().interest[day];
    if (gained <= 0) {
      continue;
    }
    const key = monthKey(day);
    const bucket = byMonth.get(key) ?? { total: 0, days: 0, lastDay: day };
    bucket.total += gained;
    bucket.days += 1;
    bucket.lastDay = day;
    byMonth.set(key, bucket);
  }

  return [...byMonth.values()].map((bucket) => ({
    day: bucket.lastDay, group: 'interest', typeIcon: '✨', walletIcon: '🐷', cls: 'savings',
    name: 'ריבית ' + monthLabel(bucket.lastDay), meta: `${bucket.days} ימים`,
    value: bucket.total, balance: series().total[bucket.lastDay], interest: true,
  }));
}

function visibleRows() {
  const interest = state.interestMode === 'daily' ? dailyInterestRows() : monthlyInterestRows();
  const rows = [...eventRows(), ...interest].filter((row) => {
    if (state.typeFilter === 'all') {
      return true;
    }
    return row.group === state.typeFilter;
  });

  /* אחרון־ראשון; בתוך אותו יום התנועה האמיתית מעל הריבית */
  return rows.sort((a, b) => b.day - a.day || Number(a.interest) - Number(b.interest));
}

function txRowHtml(row) {
  const direction = row.value >= 0 ? 'up' : 'down';
  return `<div class="tx ${row.interest ? 'interest' : ''}">
    ${iconHtml(row)}
    <span class="body"><span class="n">${row.name}</span><span class="m">${row.meta}</span></span>
    <span class="nums"><span class="a ${direction}">${amount(row.value)}</span>
    <span class="b">${shekels(row.balance)}</span></span></div>`;
}

function txListHtml() {
  const rows = visibleRows();

  /* כל חודש עטוף ב-section משלו, אחרת כל הכותרות הדביקות נתקעות יחד בראש */
  const groups = [];
  for (const row of rows) {
    const month = monthKey(row.day);
    const current = groups[groups.length - 1];
    if (!current || current.month !== month) {
      groups.push({ month, label: monthHeadLabel(row.day), rows: [row] });
    } else {
      current.rows.push(row);
    }
  }

  /* כותרות העמודות יושבות בתוך הכותרת הדביקה, ולכן נשארות גלויות בגלילה */
  const columnHeads = `<span class="nums"><span class="a">שינוי</span><span class="b">יתרה</span></span>`;
  const body = groups
    .map((group) => `<section class="monthGroup">
      <div class="monthHead"><span class="mh">${group.label}</span>${columnHeads}</div>
      ${group.rows.map(txRowHtml).join('')}</section>`)
    .join('');

  const filters = TYPE_FILTERS.map((filter) => `<button class="chip" data-act="filter" data-filter="${filter.id}"
    aria-pressed="${state.typeFilter === filter.id}">${filter.label}</button>`).join('');

  return `<div class="txWrap">
    <div class="txHead">
      <div class="txTitleRow"><span class="t">התנועות</span>
        <span class="count">${rows.length} שורות · ${DAYS} יום</span></div>
      <div class="chips">${filters}</div>
      <div class="subTitle">ריבית</div>
      <span class="seg">
        <button data-act="interest-mode" data-mode="monthly" aria-pressed="${state.interestMode === 'monthly'}">חודשית</button>
        <button data-act="interest-mode" data-mode="daily" aria-pressed="${state.interestMode === 'daily'}">יומית</button>
      </span>
    </div>
    <div class="txScroll" id="txScroll">${body || '<div class="txEmpty">אין תנועות בסינון הזה</div>'}</div>
  </div>`;
}

/* ---------------- summary screen ---------------- */

const RANGES = [
  { days: 7, label: 'שבוע', delta: 'השבוע' },
  { days: 30, label: 'חודש', delta: 'החודש' },
  { days: 365, label: 'שנה', delta: 'השנה' },
  { days: DAYS, label: 'הכל', delta: 'מאז ההתחלה' },
];

function chartCardHtml() {
  const from = windowStart();
  const range = RANGES.find((candidate) => candidate.days === state.range);
  const change = series().total[DAYS] - series().total[from];
  const allOn = WALLETS.every((wallet) => state.wallets.has(wallet.key));

  const ranges = RANGES.map((candidate) => `<button class="chip" data-act="range" data-days="${candidate.days}"
    aria-pressed="${state.range === candidate.days}">${candidate.label}</button>`).join('');

  /* שמות מקוצרים כדי שסך הכל + שלוש הקופות ייכנסו לשורה אחת */
  const walletChips = WALLETS.map((wallet) => {
    const on = state.wallets.has(wallet.key);
    return `<button class="chip" data-act="wallet" data-key="${wallet.key}" aria-pressed="${on}"
      style="${on ? 'color:' + wallet.color : ''}"><span class="sw" style="background:${wallet.color}"></span>${wallet.short}</button>`;
  }).join('');

  return `<div class="card">
    <div class="totalHead"><span class="lbl">סך הכל</span>
      <span class="amt"><small>₪</small>${Math.round(series().total[DAYS] / 100)}</span>
      <span class="delta ${change < 0 ? 'down' : ''}">${wholeShekelDelta(change)} ${range.delta}</span></div>
    <div class="chips top">${ranges}
      <button class="chip ghost allWallets" data-act="all-wallets" aria-pressed="${allOn}">כל הקופות</button></div>
    ${chartSvg()}
    <div class="chips walletChips">
      <button class="chip solid" data-act="total" aria-pressed="${state.showTotal}">סך הכל</button>
      ${walletChips}
    </div>
  </div>`;
}

function summaryPhoneHtml() {
  return `<div class="phone">
    <div class="col">
      <div class="header">
        <button class="burgerBtn" data-act="menu" aria-label="תפריט"><i></i><i></i><i></i></button>
        <span class="hname">תנועות בחשבון · ${account().name}</span>
        <span class="avatar">${account().avatar}</span>
      </div>
      ${chartCardHtml()}
      ${txListHtml()}
    </div>
  </div>`;
}

/* ---------------- menu ---------------- */

const THEME_SWATCHES = [
  { id: 'sunshine-quest', background: 'linear-gradient(135deg,#FFC34D,#E94E89)', label: 'Sunshine Quest' },
  { id: 'jungle-quest', background: 'linear-gradient(135deg,#2A9D8F,#90BE6D)', label: 'Jungle Quest' },
  { id: 'midnight-blue', background: 'linear-gradient(135deg,#1E40AF,#0A0E14)', label: 'Midnight Blue' },
];

function accountListHtml() {
  const options = ACCOUNTS.map((candidate) => {
    const selected = candidate.id === state.accountId;
    const option = `<button class="acctOpt" data-act="account" data-id="${candidate.id}"
      aria-current="${selected}">
      <span class="av">${candidate.avatar}</span>${candidate.name}
      <span class="tot">${shekels(SERIES.get(candidate.id).total[DAYS])}</span></button>`;

    /* כפתור נפרד לצד הכפתור — לא בתוכו, כי כפתור בתוך כפתור אינו HTML תקין */
    return state.pencilStyle === 'inList' && selected
      ? `<div class="acctOptRow">${option}<button class="editInList" data-act="noop"
          aria-label="עריכת ${candidate.name}" title="עריכת ${candidate.name}">✏️</button></div>`
      : option;
  }).join('');

  return `<div class="acctList">${options}
    <button class="acctOpt add" data-act="noop"><span class="av">＋</span>חשבון חדש</button></div>`;
}

function menuPhoneHtml() {
  const current = account();
  const theme = THEME_BY_ACCOUNT.get(current.id);

  const swatches = THEME_SWATCHES.map((swatch) => `<button class="swatch" data-act="theme" data-theme="${swatch.id}"
    aria-pressed="${theme === swatch.id}" aria-label="${swatch.label}" title="${swatch.label}"
    style="background:${swatch.background}"></button>`).join('');

  return `<div class="phone">
    <div class="menuPanel" data-open="${state.menuOpen}">
      <div class="menuBar">
        <button class="burgerBtn" data-act="menu" aria-label="סגירה"><i></i><i></i><i></i></button>
        <span class="t">תפריט</span>
      </div>
      <div class="menuContent">

        <div class="scopeBlock global">
          <button class="acctBtn" data-act="account-toggle" aria-expanded="${state.accountListOpen}">
            <span class="av">${current.avatar}</span>
            <span class="nm"><b>${current.name}</b><span>${shekels(series().total[DAYS])} · מוצג כרגע</span></span>
            <span class="car">${state.accountListOpen ? '▲' : '▼'}</span>
          </button>
          ${state.pencilStyle === 'under'
            ? `<button class="editUnder" data-act="noop">✏️ עריכת ${current.name}</button>`
            : ''}
          ${state.accountListOpen ? accountListHtml() : ''}
        </div>

        <div class="scopeBlock perAccount">
          <div class="scopeHead"><span class="ttl">הגדרות של ${current.name} ${current.avatar}</span></div>
          <div class="scopeSub">נשמר על החשבון הזה בלבד.</div>

          <div class="menuLabel">מסכים</div>
          <button class="menuRow" data-act="noop"><span class="ic">🏠</span>בית<span class="chev">‹</span></button>
          <button class="menuRow" aria-current="page" data-act="noop"><span class="ic">📈</span>תנועות בחשבון<span class="chev">‹</span></button>

          <div class="menuLabel">מראה</div>
          <div class="swatches">${swatches}</div>

          <div class="menuLabel">שפה</div>
          <span class="seg"><button aria-pressed="true" data-act="noop">עברית</button>
            <button aria-pressed="false" data-act="noop">EN</button></span>
        </div>

      </div>
    </div>
  </div>`;
}

/* ---------------- render + events ---------------- */

function renderControlGroup(id, styles, action, selected) {
  document.getElementById(id).innerHTML = styles.map((style) =>
    `<button data-act="${action}" data-style="${style.id}"
      aria-pressed="${selected === style.id}">${style.label}</button>`).join('');
}
function renderIconControls() {
  renderControlGroup('iconControls', ICON_STYLES, 'icon-style', state.iconStyle);
  renderControlGroup('pencilControls', PENCIL_STYLES, 'pencil-style', state.pencilStyle);
}

function render() {
  renderIconControls();
  const scroller = document.getElementById('txScroll');
  const scrollTop = scroller ? scroller.scrollTop : 0;

  document.documentElement.dataset.theme = THEME_BY_ACCOUNT.get(state.accountId);
  document.getElementById('summaryPhone').innerHTML = summaryPhoneHtml();
  document.getElementById('menuPhone').innerHTML = menuPhoneHtml();

  const next = document.getElementById('txScroll');
  if (next) {
    next.scrollTop = scrollTop;
  }
}

const SKIP_RENDER = true;

const ACTIONS = {
  noop: () => {},
  /* מחליף רק את התכונה על הפאנל הקיים; בנייה מחדש של ה-DOM היא מה שגרם לקפיצה */
  menu: () => {
    state.menuOpen = !state.menuOpen;
    document.querySelector('.menuPanel').dataset.open = String(state.menuOpen);
    return SKIP_RENDER;
  },
  axis: (target) => {
    state.rtlAxis = !state.rtlAxis;
    target.setAttribute('aria-pressed', String(state.rtlAxis));
    target.textContent = state.rtlAxis ? 'ציר זמן: ימין→שמאל (RTL)' : 'ציר זמן: שמאל→ימין (LTR)';
  },
  range: (target) => { state.range = Number(target.dataset.days); },
  total: () => { state.showTotal = !state.showTotal; },
  wallet: (target) => {
    const key = target.dataset.key;
    if (state.wallets.has(key)) {
      state.wallets.delete(key);
    } else {
      state.wallets.add(key);
    }
  },
  'all-wallets': () => {
    const allOn = WALLETS.every((wallet) => state.wallets.has(wallet.key));
    state.wallets = allOn ? new Set() : new Set(WALLETS.map((wallet) => wallet.key));
  },
  filter: (target) => { state.typeFilter = target.dataset.filter; },
  'icon-style': (target) => { state.iconStyle = target.dataset.style; },
  'pencil-style': (target) => { state.pencilStyle = target.dataset.style; },
  'interest-mode': (target) => { state.interestMode = target.dataset.mode; },
  'account-toggle': () => { state.accountListOpen = !state.accountListOpen; },
  account: (target) => {
    state.accountId = target.dataset.id;
    state.accountListOpen = false;
  },
  theme: (target) => { THEME_BY_ACCOUNT.set(state.accountId, target.dataset.theme); },
};

document.addEventListener('click', (event) => {
  if (state.accountListOpen && !event.target.closest('.scopeBlock.global')) {
    state.accountListOpen = false;
    render();
  }

  const target = event.target.closest('[data-act]');
  if (!target) {
    return;
  }
  const action = ACTIONS[target.dataset.act];
  if (!action) {
    return;
  }
  if (action(target) !== SKIP_RENDER) {
    render();
  }
});

render();
