export const INTEREST_STATS_TEST_IDS = {
  stats: 'wallet-stat-strip',
  principal: 'wallet-deposits',
  interestEarned: 'wallet-interest-gain',
  interestEarnedToday: 'wallet-today-interest',
} as const;

export const INTEREST_STATS_COPY = {
  principalLabel: 'הפקדת',
  interestEarnedLabel: 'רווח מריבית',
  interestEarnedTodayLabel: 'היום',
} as const;

export const INTEREST_STATS_STYLE = {
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
