import { COLORS, STOPS } from '../palette';
import { buildGradients } from '../gradients';
import { SHADOW_SCALE } from '../shadows';
import { TYPE_SCALE } from '../typography';
import type { ThemeTokens } from '../theme-tokens';

export const sunshineQuest: ThemeTokens = {
  colors: COLORS,
  gradients: buildGradients(STOPS),
  shadows: SHADOW_SCALE,
  typography: TYPE_SCALE,
};
