export const MENU_OVERLAY_TEST_IDS = {
  overlay: 'menu-overlay',
  closeButton: 'menu-overlay-close',
} as const;

export const MENU_OVERLAY_CONTENT = {
  title: 'תפריט',
  closeLabel: 'סגירה',
} as const;

export const ESCAPE_KEY = 'Escape';

export const MENU_OVERLAY_STYLE = {
  zIndex: 50,
  closedScale: 0.92,
  transitionMs: 300,
  paddingBottom: 22,
} as const;

export const MENU_OVERLAY_LAYOUT = {
  statusbarSpacer: 24,
  barMarginX: 14,
  barMarginTop: 6,
  barPaddingX: 14,
  barPaddingY: 10,
  barGap: 10,
  titleWeight: 700,
} as const;
