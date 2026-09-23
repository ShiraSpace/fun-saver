import { LAYERS } from '@/theme/layers';

export const MENU_TEST_IDS = {
  menuButton: 'menu-button',
  menuIcon: 'menu-icon',
} as const;

export const MENU_TOGGLE = {
  zIndex: LAYERS.overlayForeground,
} as const;

export const MENU_LAYOUT = {
  blockGap: 14,
} as const;

export const MENU_ROW_STYLE = {
  borderWidth: 1.5,
  pressScale: 0.98,
  pressMs: 120,
  gap: 10,
  paddingY: 8,
  paddingX: 11,
  radius: 14,
} as const;

export const MENU_ICON = {
  buttonSize: 44,
  iconSize: 26,
  barHeight: 3,
  barRadius: 2,
  spinDegrees: 180,
  crossAngle: 45,
  transitionMs: 320,
} as const;
