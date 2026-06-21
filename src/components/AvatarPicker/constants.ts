export const AVATAR_PICKER_TEST_IDS = {
  container: 'avatar-picker',
  option: 'avatar-option',
} as const;

export const AVATAR_PICKER_LAYOUT = {
  columns: 4,
  gap: 12,
  maxWidth: 340,
} as const;

export const AVATAR_PICKER_STYLE = {
  borderWidth: 3,
  ringWidth: 4,
  hoverLift: 2,
  transitionMs: 100,
  baseShadow: '0 3px 0 rgba(0, 0, 0, 0.12)',
} as const;
