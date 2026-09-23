export const SHADOW_SCALE = {
  faint: 'rgba(0, 0, 0, 0.06)',
  soft: 'rgba(0, 0, 0, 0.12)',
  mid: 'rgba(0, 0, 0, 0.16)',
  deep: 'rgba(0, 0, 0, 0.25)',
} as const;

export type ThemeShadows = typeof SHADOW_SCALE;
