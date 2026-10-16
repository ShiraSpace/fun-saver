export const INTEREST_COIN_BUTTON_TEST_IDS = {
  coin: 'interest-coin',
  amount: 'interest-coin-amount',
} as const;

export const INTEREST_COIN_BUTTON_COPY = {
  earnedSign: '+',
  coinLabel: (shekels: number): string => `₪${shekels} ריבית, לחצו כדי להכניס לחיסכון`,
} as const;
