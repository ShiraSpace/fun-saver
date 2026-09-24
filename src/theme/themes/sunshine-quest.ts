import { SUNSHINE_QUEST_COLORS } from '../palette';
import { themeGradients } from '../gradients';
import { SHADOW_SCALE } from '../shadows';
import { TINT_SCALE } from '../tints';
import { TYPE_SCALE } from '../typography';
import type { ThemeGradientStops, ThemeTokens } from '../theme-tokens';

const GRADIENT_STOPS = {
  screen: ['#FFC34D', '#FF8A4C', '#E94E89'],
  primaryButton: ['#8A3AAE', '#6B2C8E'],
  avatarBadge: ['#FFE6B0', '#FFC34D'],
  walletSavings: ['#FFE6B0', '#FFC34D'],
  walletSpending: ['#FFD8C7', '#FF8A4C'],
  walletGoodDeeds: ['#FBC4DA', '#E94E89'],
} as const satisfies ThemeGradientStops;

export const sunshineQuest: ThemeTokens = {
  colors: SUNSHINE_QUEST_COLORS,
  gradients: themeGradients(GRADIENT_STOPS),
  shadows: SHADOW_SCALE,
  tints: TINT_SCALE,
  typography: TYPE_SCALE,
};
