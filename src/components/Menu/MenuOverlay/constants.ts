export const MENU_OVERLAY_TEST_IDS = {
  overlay: 'menu-overlay',
  title: 'menu-title',
} as const;

export const MENU_OVERLAY_CONTENT = {
  title: 'תפריט',
} as const;

export const ESCAPE_KEY = 'Escape';

export const MENU_OVERLAY_STYLE = {
  zIndex: 50,
  closedScale: 0.92,
  transitionMs: 300,
  paddingBottom: 22,
} as const;

export const MENU_OVERLAY_LAYOUT = {
  barPaddingX: 14,
  barPaddingBottom: 10,
  barGap: 10,
  titleWeight: 700,
  contentPaddingX: 22,
  contentPaddingTop: 6,
} as const;
