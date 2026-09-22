import { DEPOSIT_SPLIT } from '@/lib/constants';
import { share } from '../constants';
import { WALLETS_COPY } from './wallets';

const APP_SPLIT = WALLETS_COPY.pots
  .map((wallet) => share(DEPOSIT_SPLIT[wallet]))
  .join(' / ');

export const ACTIONS_COPY = {
  title: 'מה צריך לעשות',
  intro: {
    kind: 'text',
    muted: true,
    body: 'חמש החלטות ושיחה אחת. את ההחלטות כדאי לקבל לפני השיחה, לא באמצע.',
  },
  amount: {
    kind: 'text',
    body: '**כמה?** אין בישראל סכום רשמי. בגיל 5–7 מקובל ₪5–15 לשבוע, בגיל 8–10 מקובל ₪10–30. **הסכום פחות חשוב מהקביעוּת שלו** — זה הדבר היחיד שכל המקורות מסכימים עליו.',
  },
  frequency: {
    kind: 'text',
    body: '**כל כמה זמן?** עד גיל 9 — שבועי. שבוע הוא בערך כמה שילד בן 7 מסוגל לתכנן קדימה. כסף חודשי נגמר בשבוע הראשון ומשאיר שלושה שבועות ריקים בלי שום לקח.',
  },
  split: {
    kind: 'text',
    body: '**איך מחלקים?** ברירת המחדל 50/40/10. **אף חלוקה לא נבדקה מחקרית מול אחרת** — זו החלטה של ערכים משפחתיים, לא ממצא.',
  },
  chores: {
    kind: 'text',
    body: '**קשור למטלות?** לא, ומומלץ שלא.',
  },
  choresEvidence: {
    kind: 'quote',
    body: 'בעשרה גני ילדים בחיפה הכניסו קנס על איחור באיסוף הילדים — ומספר המאחרים **עלה**. כשמצמידים כסף למחויבות חברתית, הכסף מחליף אותה — וכשמסירים את הכסף, המחויבות לא חוזרת.',
    citation: 'Gneezy & Rustichini, A Fine is a Price, 2000',
  },
  rescue: {
    kind: 'text',
    body: '**וכשנגמר הכסף באמצע השבוע — מחכים לשבוע הבא.** זו לא החלטה, זה הכלל: לא ממלאים מראש, ולא לוקחים מהחיסכון. אם ממלאים — אין תוצאה, ואם אין תוצאה אין מה ללמוד, ושלוש הקופות הופכות לקישוט.',
  },
  decide: {
    label: 'להחליט · להגדיר באפליקציה',
    items: [
      { done: true, question: 'כמה בשבוע?', answer: 'שלכם: **₪30**' },
      { done: true, question: 'כל כמה זמן?', answer: 'שלכם: **שבועי**' },
      {
        done: true,
        question: 'איך מחלקים?',
        answer: `באפליקציה: **${APP_SPLIT}**`,
      },
      { done: true, question: 'קשור למטלות?', answer: 'שלכם: **לא**' },
      {
        done: false,
        question: 'מה יעד החיסכון?',
        answer: 'עוד לא נבחר · הילד בוחר, אתם מגדירים באפליקציה',
      },
    ],
  },
  communicate: {
    label: 'לתקשר',
    items: [
      {
        done: false,
        question: 'לקיים את השיחה הראשונה',
        answer: 'לפני ההפקדה הראשונה, לא אחריה · הנוסח בסעיף 5',
      },
    ],
  },
  example: {
    title: 'דוגמה — ₪30 לשבוע, בן כמעט 7',
    table: {
      headers: ['קופה', 'לשבוע', 'לחודש', 'לשנה'],
      rows: [
        { wallet: 'spending', amounts: ['₪15', '₪65', '₪780'] },
        { wallet: 'savings', amounts: ['₪12', '₪52', '₪624'] },
        { wallet: 'goodDeeds', amounts: ['₪3', '₪13', '₪156'] },
      ],
    },
    note: {
      kind: 'text',
      muted: true,
      body: '₪15 לשבוע זה בערך גלידה אחת. מספיק כדי לבחור, לא מספיק כדי שהבחירה תהיה קלה.',
    },
  },
} as const;
