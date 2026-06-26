export const TYPE_SCALE = {
  display: 48,
  title: 22,
  heading: 18,
  body: 15,
  label: 12,
} as const;

export const FONT_WEIGHTS = {
  regular: 500,
  medium: 600,
  bold: 700,
  heavy: 800,
} as const;

export type ThemeTypography = typeof TYPE_SCALE;
