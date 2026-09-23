export const STAT_STRIP_TEST_IDS = {
  strip: 'wallet-stat-strip',
  deposits: 'wallet-deposits',
  interestGain: 'wallet-interest-gain',
  todayInterest: 'wallet-today-interest',
} as const;

export const STAT_STRIP_COPY = {
  depositsLabel: 'הפקדת',
  interestGainLabel: 'רווח מריבית',
  todayLabel: 'היום',
} as const;

export const STAT_STRIP_STYLE = {
  gap: 8,
  marginTop: 10,
  paddingTop: 10,
  cellPaddingY: 8,
  cellPaddingX: 6,
  cellGap: 3,
  cellRadius: 12,
  labelSize: 11,
  amountSize: 17,
} as const;
