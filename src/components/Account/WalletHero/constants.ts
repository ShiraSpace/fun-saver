export const WALLET_HERO_TEST_IDS = {
  balance: 'wallet-balance',
  eyebrow: 'hero-eyebrow',
  icon: 'hero-icon',
  interestRate: 'hero-interest-rate',
  activeSince: 'hero-active-since',
} as const;

const PERCENT_PER_UNIT = 100;
const HEBREW_DAY_MONTH = new Intl.DateTimeFormat('he', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const dayMonth = (isoDate: string): string =>
  HEBREW_DAY_MONTH.format(new Date(`${isoDate}T00:00:00Z`));

export const WALLET_HERO_COPY = {
  eyebrow: (name: string): string => `החיסכון של ${name}`,
  icon: '🐷',
  interestRate: (monthlyRate: number): string =>
    `צובר ריבית — ${Math.round(monthlyRate * PERCENT_PER_UNIT)}%/חודש`,
  activeSince: (openedAt: string): string => `פעיל מאז ${dayMonth(openedAt)}`,
} as const;
