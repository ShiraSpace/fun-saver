export const SINGLE_DAY_DOT_RADIUS = 3;

export const BALANCE_LINE_TEST_IDS = {
  line: (shownBalance: string): string => `balance-line-${shownBalance}`,
} as const;
