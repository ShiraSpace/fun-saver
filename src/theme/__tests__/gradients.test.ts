import { buildGradients } from '../gradients';
import type { ThemeStops } from '../theme-tokens';

const STOPS = {
  screen: ['#111111', '#222222', '#333333'],
  primaryButton: ['#444444', '#555555'],
  sunnyTile: ['#666666', '#777777'],
  walletSavings: ['#888888', '#999999'],
  walletSpending: ['#AAAAAA', '#BBBBBB'],
  walletGoodDeeds: ['#CCCCCC', '#DDDDDD'],
} as const satisfies ThemeStops;

describe('buildGradients', () => {
  it('runs the screen down one diagonal and every tile down another', () => {
    expect(buildGradients(STOPS)).toEqual({
      screen: 'linear-gradient(160deg, #111111, #222222, #333333)',
      primaryButton: 'linear-gradient(#444444, #555555)',
      sunnyTile: 'linear-gradient(135deg, #666666, #777777)',
      walletSavings: 'linear-gradient(135deg, #888888, #999999)',
      walletSpending: 'linear-gradient(135deg, #AAAAAA, #BBBBBB)',
      walletGoodDeeds: 'linear-gradient(135deg, #CCCCCC, #DDDDDD)',
    });
  });
});
