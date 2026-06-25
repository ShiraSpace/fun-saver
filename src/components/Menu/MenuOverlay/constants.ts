import { LAYERS } from '@/theme/layers';

export const MENU_OVERLAY_TEST_IDS = {
  overlay: 'menu-overlay',
} as const;

export const MENU_OVERLAY_CONTENT = {
  title: 'תפריט',
} as const;

export const ESCAPE_KEY = 'Escape';

export const MENU_OVERLAY_STYLE = {
  zIndex: LAYERS.overlay,
  closedScale: 0.92,
  transitionMs: 300,
  paddingBottom: 22,
} as const;

export const MENU_OVERLAY_LAYOUT = {
  contentPaddingX: 22,
  contentPaddingTop: 92,
} as const;
