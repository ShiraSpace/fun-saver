export const CHOICE_CHIPS_VARIANT = {
  chips: 'chips',
  segmented: 'segmented',
} as const;

export type ChoiceChipsVariant =
  (typeof CHOICE_CHIPS_VARIANT)[keyof typeof CHOICE_CHIPS_VARIANT];

export const CHOICE_CHIPS_TEST_IDS = {
  option: (testId: string, choiceId: string): string => `${testId}-${choiceId}`,
} as const;
