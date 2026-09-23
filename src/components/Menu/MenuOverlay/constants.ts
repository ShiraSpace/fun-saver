import { LAYERS } from '@/theme/layers';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import { HEADER_LAYOUT } from '@/components/Header/constants';

export const MENU_OVERLAY_TEST_IDS = {
  overlay: 'menu-overlay',
  methodLink: 'menu-method-link',
} as const;

export const MENU_OVERLAY_CONTENT = {
  title: 'תפריט',
  methodLink: 'השיטה',
} as const;

export const ESCAPE_KEY = 'Escape';

export const KEY_DOWN_EVENT = 'keydown';

export const MENU_OVERLAY_STYLE = {
  zIndex: LAYERS.overlay,
  closedScale: 0.92,
  transitionMs: 300,
  paddingBottom: 22,
} as const;

export const MENU_OVERLAY_LAYOUT = {
  contentPaddingX: 22,
  contentPaddingTop: 8,
  top: SCREEN_LAYOUT.paddingY + HEADER_LAYOUT.height,
} as const;

export const MENU_LINK_STYLE = {
  paddingY: 14,
  radius: 14,
  dividerOpacity: 0.28,
} as const;
