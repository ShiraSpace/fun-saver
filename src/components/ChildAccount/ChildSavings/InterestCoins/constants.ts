export const INTEREST_COINS_TEST_IDS = {
  copy: 'interest-coins-copy',
  coin: 'interest-coin',
  amount: 'interest-coin-amount',
} as const;

export const INTEREST_COINS_COPY = {
  tapTheCoins: 'הכסף הרוויח לבד! לחצו על המטבעות',
  earnedSign: '+',
  coinLabel: (shekels: number): string => `₪${shekels} ריבית, לחצו כדי להכניס לחיסכון`,
} as const;
