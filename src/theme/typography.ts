export const TYPE_SCALE = {
  display: 48,
  amount: 38,
  title: 22,
  heading: 18,
  body: 15,
  label: 12,
} as const;

export type ThemeTypography = typeof TYPE_SCALE;
