import type { ThemeGradients, ThemeGradientStops } from './theme-tokens';

const SCREEN_ANGLE = '160deg';
const TILE_ANGLE = '135deg';

const angled = (angle: string, stops: readonly string[]): string =>
  `linear-gradient(${angle}, ${stops.join(', ')})`;

export function themeGradients(stops: ThemeGradientStops): ThemeGradients {
  return {
    screen: angled(SCREEN_ANGLE, stops.screen),
    primaryButton: `linear-gradient(${stops.primaryButton.join(', ')})`,
    avatarBadge: angled(TILE_ANGLE, stops.avatarBadge),
    walletSavings: angled(TILE_ANGLE, stops.walletSavings),
    walletSpending: angled(TILE_ANGLE, stops.walletSpending),
    walletGoodDeeds: angled(TILE_ANGLE, stops.walletGoodDeeds),
  };
}
