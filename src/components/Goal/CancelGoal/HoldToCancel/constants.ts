export const HOLD_KEYS: readonly string[] = [' ', 'Enter'];

export const PRIMARY_POINTER_BUTTON = 0;

export const HOLD_TO_CANCEL = {
  holdMs: 2000,
} as const;

const MS_PER_SECOND = 1000;

const HOLD_SECONDS = HOLD_TO_CANCEL.holdMs / MS_PER_SECOND;

export const HOLD_TO_CANCEL_TEST_IDS = {
  button: 'hold-to-cancel',
  fill: 'hold-to-cancel-fill',
  cancelError: 'hold-to-cancel-error',
} as const;

export const HOLD_TO_CANCEL_COPY = {
  label: '✋ לחיצה ארוכה לביטול היעד',
  ariaLabel: `ביטול היעד: להחזיק את הכפתור ${HOLD_SECONDS} שניות`,
  hint: `להחזיק ${HOLD_SECONDS} שניות`,
  cancelError: 'לא הצלחנו לבטל את היעד, נסו שוב',
} as const;
