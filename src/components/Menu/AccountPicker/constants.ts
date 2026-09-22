export const ACCOUNT_PICKER_TEST_IDS = {
  picker: 'menu-account-picker',
  trigger: 'menu-account-trigger',
  triggerTotal: 'menu-account-trigger-total',
  caret: 'menu-account-caret',
} as const;

export const ACCOUNT_PICKER_CONTENT = {
  currentSuffix: ' · מוצג כרגע',
  openCaret: '▲',
  closedCaret: '▼',
} as const;

export const ACCOUNT_PICKER_STYLE = {
  avatarSize: 38,
  gap: 10,
  paddingY: 10,
  paddingX: 12,
  radius: 16,
  borderWidth: 1.5,
  listGap: 5,
  subGap: 1,
  pressScale: 0.98,
  pressMs: 120,
} as const;
