import { themeGradients } from '../gradients';
import type { ThemeGradientStops } from '../theme-tokens';

const mockStops = {
  screen: ['#111111', '#222222', '#333333'],
  primaryButton: ['#444444', '#555555'],
  avatarBadge: ['#666666', '#777777'],
  walletSavings: ['#888888', '#999999'],
  walletSpending: ['#AAAAAA', '#BBBBBB'],
  walletGoodDeeds: ['#CCCCCC', '#DDDDDD'],
} as const satisfies ThemeGradientStops;

describe('themeGradients', () => {
  it('runs the screen down one diagonal and every tile down another', () => {
    expect(themeGradients(mockStops)).toEqual({
      screen: 'linear-gradient(160deg, #111111, #222222, #333333)',
      primaryButton: 'linear-gradient(#444444, #555555)',
      avatarBadge: 'linear-gradient(135deg, #666666, #777777)',
      walletSavings: 'linear-gradient(135deg, #888888, #999999)',
      walletSpending: 'linear-gradient(135deg, #AAAAAA, #BBBBBB)',
      walletGoodDeeds: 'linear-gradient(135deg, #CCCCCC, #DDDDDD)',
    });
  });
});
