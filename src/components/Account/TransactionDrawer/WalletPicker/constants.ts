export const WALLET_PICKER_TEST_IDS = {
  wallet: (name: string): string => `wallet-picker-${name}`,
  balance: (name: string): string => `wallet-picker-balance-${name}`,
} as const;
