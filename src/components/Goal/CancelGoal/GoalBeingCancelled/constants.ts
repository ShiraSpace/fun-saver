export const GOAL_BEING_CANCELLED_TEST_IDS = {
  title: 'cancel-goal-title',
  saved: 'cancel-goal-saved',
  amount: 'cancel-goal-amount',
  moneyStays: 'cancel-goal-money-stays',
} as const;

export const GOAL_BEING_CANCELLED_COPY = {
  title: (goalName: string): string => `לבטל את היעד „${goalName}”?`,
  savedSoFar: 'כבר נחסכו',
  outOf: 'מתוך',
  sentenceEnd: '.',
  moneyStays: 'הכסף נשאר בקופת החיסכון.',
  moneyStaysAndSavingsOpens: 'הכסף נשאר בקופת החיסכון, והקופה תיפתח למשיכה.',
} as const;
