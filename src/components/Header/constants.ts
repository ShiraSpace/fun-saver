import { LAYERS } from '@/theme/layers';
import { MENU_ICON } from '@/components/Menu/constants';

export const HEADER_TEST_IDS = {
  bar: 'header',
  avatar: 'header-avatar',
  homeLink: 'header-home-link',
} as const;

export const HEADER_CONTENT = {
  homeLabel: 'חזרה לבית',
  homeIcon: '🏠',
} as const;

export const HEADER_AVATAR_PROPS = {
  size: 40,
} as const;

const PADDING_Y = 12;

export const HEADER_LAYOUT = {
  paddingX: 16,
  paddingY: PADDING_Y,
  height: MENU_ICON.buttonSize + PADDING_Y * 2,
  gap: 10,
  radius: 18,
  shadow: '0 4px 0 rgba(0, 0, 0, 0.06)',
  nameWeight: 700,
  foregroundZIndex: LAYERS.overlayForeground,
  transitionMs: 300,
} as const;
