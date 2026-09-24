import { COLORS } from '../palette';
import { buildGradients } from '../gradients';
import { SHADOW_SCALE } from '../shadows';
import { TINT_SCALE } from '../tints';
import { TYPE_SCALE } from '../typography';
import type { ThemeStops, ThemeTokens } from '../theme-tokens';

const STOPS = {
  screen: ['#FFC34D', '#FF8A4C', '#E94E89'],
  primaryButton: ['#8A3AAE', '#6B2C8E'],
  sunnyTile: ['#FFE6B0', '#FFC34D'],
  potSavings: ['#FFE6B0', '#FFC34D'],
  potSpending: ['#FFD8C7', '#FF8A4C'],
  potGood: ['#FBC4DA', '#E94E89'],
} as const satisfies ThemeStops;

export const sunshineQuest: ThemeTokens = {
  colors: COLORS,
  gradients: buildGradients(STOPS),
  shadows: SHADOW_SCALE,
  tints: TINT_SCALE,
  typography: TYPE_SCALE,
};
