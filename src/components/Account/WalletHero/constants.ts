export const WALLET_HERO_TEST_IDS = {
  hero: 'wallet-hero',
  cornerStar: 'hero-corner-star',
  balance: 'wallet-balance',
  eyebrow: 'hero-eyebrow',
  icon: 'hero-icon',
  interestRate: 'hero-interest-rate',
  activeSince: 'hero-active-since',
  deposits: 'hero-deposits',
  interestGain: 'hero-interest',
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
  depositsLabel: 'הפקדות',
  interestGainLabel: 'רווח מריבית',
  totalLabel: 'סך הכל בקופה',
} as const;

export const HERO_STYLE = {
  radius: 24,
  padding: 13,
  shadow: '0 6px 0 rgba(0, 0, 0, 0.06)',
  cornerStarSize: 42,
  cornerStarTop: -12,
  cornerStarRight: -10,
  cornerStarRotation: -18,
  headGap: 12,
  iconTileSize: 52,
  iconTileRadius: 20,
  iconFontSize: 28,
  breakdownGap: 10,
  cellRadius: 14,
  cellPadding: 9,
} as const;
