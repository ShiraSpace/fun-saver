export const SOURCES_COPY = {
  title: 'המקורות',
  intro: {
    kind: 'text',
    body: 'כל מספר בעמוד הזה מגיע ממקום. הנה מאיפה.',
  },
  more: {
    kind: 'text',
    muted: true,
    body: 'הרחבה מלאה, כולל מה **לא** הצלחנו לבסס: docs/research/jar-method.md',
  },
  list: [
    {
      id: 'partitioning',
      claim: 'חלוקה לקופות מגדילה חיסכון ב-72%',
      citation:
        'Soman & Cheema, Earmarking and Partitioning, Journal of Marketing Research 48, 2011',
      url: 'https://journals.sagepub.com/doi/10.1509/jmkr.48.SPL.S14',
    },
    {
      id: 'mentalAccounting',
      claim: 'כסף מסומן אינו בר־המרה',
      citation: 'Thaler, Mental Accounting Matters, JBDM 12(3), 1999',
      url: 'https://people.bath.ac.uk/mnsrf/Teaching%202011/Thaler-99.pdf',
    },
    {
      id: 'adultReliability',
      claim: 'ההמתנה תלויה באמינות המבוגר',
      citation:
        'Kidd, Palmeri & Aslin, Rational Snacking, Cognition 126(1), 2013',
      url: 'https://www.strategian.com/fulltext/Kidd2013.pdf',
    },
    {
      id: 'marshmallowReplication',
      claim: 'מבחן המרשמלו — הרפליקציה שצמצמה את הממצא',
      citation: 'Watts, Duncan & Quan, Psychological Science, 2018',
      url: 'https://journals.sagepub.com/doi/abs/10.1177/0956797618761661',
    },
    {
      id: 'givingToddlers',
      claim: 'פעוטות שמחים יותר לתת מאשר לקבל',
      citation: 'Aknin, Hamlin & Dunn, PLoS ONE 7(6), 2012',
      url: 'https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0039211',
    },
    {
      id: 'overjustification',
      claim: 'פרס מובטח פוגע במוטיבציה פנימית',
      citation: 'Lepper, Greene & Nisbett, 1973',
      url: 'https://en.wikipedia.org/wiki/Overjustification_effect',
    },
    {
      id: 'finePrice',
      claim: 'קנס על איחור הגדיל איחורים — עשרה גנים בחיפה',
      citation:
        'Gneezy & Rustichini, A Fine is a Price, Journal of Legal Studies 29(1), 2000',
      url: 'https://rady.ucsd.edu/_files/faculty-research/uri-gneezy/fine.pdf',
    },
    {
      id: 'financialEducation',
      claim: 'חינוך פיננסי: השפעה על ידע גדולה מההשפעה על התנהגות',
      citation: 'Kaiser & Menkhoff, Economics of Education Review, 2020',
      url: 'https://epub.ub.uni-muenchen.de/69210/1/187.pdf',
    },
    {
      id: 'allowanceNoStructure',
      claim: 'דמי כיס ללא מסגרת — הציון הנמוך ביותר',
      citation: 'Mandell, Jump$tart survey 2000',
      url: 'http://lewismandell.com/child_allowances_-_beneficial_or_harmful',
    },
    {
      id: 'cardSpending',
      claim: 'תשלום בכרטיס מגדיל נכונות לשלם',
      citation:
        'Prelec & Simester, Always Leave Home Without It, Marketing Letters 12(1), 2001',
      url: 'https://link.springer.com/article/10.1023/A:1008196717017',
    },
    {
      id: 'allowanceRanges',
      claim: 'טווחי דמי כיס בישראל לפי גיל',
      citation: 'mako',
      url: 'https://www.mako.co.il/finances-money/Article-b585a099e13af91027.htm',
    },
    {
      id: 'cashInIsrael',
      claim: '85% מההורים בישראל נותנים במזומן',
      citation: 'סקר גיאוקרטוגרפיה, 2022',
      url: 'https://www.geokg.com/',
    },
    {
      id: 'israeliAllowanceShare',
      claim: '74% מההורים בישראל נותנים דמי כיס',
      citation: 'דוח בנק הפועלים 2025, דרך ynet',
      url: 'https://www.ynet.co.il/economy/article/skk6czlcbg',
    },
    {
      id: 'childSavings',
      claim: 'חיסכון לכל ילד — ₪58 לחודש',
      citation: 'המוסד לביטוח לאומי',
      url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/HisahonKupot.aspx',
    },
    {
      id: 'planningHorizon',
      claim: 'טווח התכנון של ילדים צעירים — שבועי עדיף',
      citation: 'ריכוז המלצות',
      url: 'https://www.pennytime.app/learn/blog/how-much-allowance-by-age/',
    },
    {
      id: 'habitWindow',
      claim: 'גיל 6–12 הוא החלון שבו נבנים הרגלים ונורמות',
      citation: 'CFPB, Money as You Grow',
      url: 'https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/',
    },
  ],
} as const;
