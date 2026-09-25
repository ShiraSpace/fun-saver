export const CHOICE_CHIPS_TEST_IDS = {
  option: (testId: string, choiceId: string): string => `${testId}-${choiceId}`,
} as const;
