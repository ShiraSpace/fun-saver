export const TINT_SCALE = {
  film: 'rgba(255, 255, 255, 0.25)',
  shade: 'rgba(40, 20, 60, 0.42)',
} as const;

export type ThemeTints = typeof TINT_SCALE;
