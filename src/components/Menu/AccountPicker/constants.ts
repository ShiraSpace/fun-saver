export const ACCOUNT_PICKER_TEST_IDS = {
  picker: 'menu-account-picker',
  trigger: 'menu-account-trigger',
  currentTotalBalance: 'menu-account-trigger-total',
  caret: 'menu-account-caret',
} as const;

export const ACCOUNT_PICKER_COPY = {
  currentSuffix: ' · מוצג כרגע',
  openCaret: '▲',
  closedCaret: '▼',
} as const;

export const OUTSIDE_CLICK_EVENT = 'mousedown';

export const ACCOUNT_PICKER_STYLE = {
  avatarSize: 38,
  gap: 10,
  paddingY: 10,
  paddingX: 12,
  radius: 16,
  subGap: 1,
} as const;
