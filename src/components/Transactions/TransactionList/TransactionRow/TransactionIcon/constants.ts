export const TRANSACTION_ICON_TEST_IDS = {
  icon: (key: string): string => `transaction-icon-${key}`,
  badge: (key: string): string => `transaction-icon-${key}-badge`,
} as const;
