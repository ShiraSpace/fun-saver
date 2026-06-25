import { LAYERS } from '@/theme/layers';

export const HEADER_TEST_IDS = {
  bar: 'header',
  avatar: 'header-avatar',
} as const;

export const HEADER_AVATAR_PROPS = {
  size: 40,
} as const;

export const HEADER_LAYOUT = {
  paddingX: 16,
  paddingY: 12,
  gap: 10,
  radius: 18,
  shadow: '0 4px 0 rgba(0, 0, 0, 0.06)',
  nameWeight: 700,
  foregroundZIndex: LAYERS.overlayForeground,
  transitionMs: 300,
} as const;
