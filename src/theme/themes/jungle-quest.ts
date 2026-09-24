import { themeGradients } from '../gradients';
import { SHADOW_SCALE } from '../shadows';
import { TINT_SCALE } from '../tints';
import { TYPE_SCALE } from '../typography';
import type { ThemeGradientStops, ThemeTokens } from '../theme-tokens';

const GRADIENT_STOPS = {
  screen: ['#2A9D8F', '#43AA8B', '#90BE6D'],
  primaryButton: ['#1B7A6B', '#12564B'],
  avatarBadge: ['#52B69A', '#2A9D8F'],
  walletSavings: ['#52B69A', '#2A9D8F'],
  walletSpending: ['#B5D94C', '#90BE6D'],
  walletGoodDeeds: ['#F4A261', '#E76F51'],
} as const satisfies ThemeGradientStops;

export const jungleQuest: ThemeTokens = {
  colors: {
    primary: '#2A9D8F',
    primaryText: '#1B7A6B',
    primaryShadow: '#0B3A33',
    primaryGlow: 'rgba(27, 122, 107, 0.45)',
    textOnPrimary: '#FFFFFF',
    surface: '#FFFDF5',
    textMuted: '#4B655B',
    textStrong: '#1B4332',
    textOnWallet: '#2B1800',
    labelShade: 'rgba(0, 0, 0, 0.35)',
    selectionRing: '#2B1800',
    star: '#F9C74F',
    divider: '#DDE7CC',
    softBg: '#F3F7E4',
    softBorder: '#B5D94C',
    softText: '#4A6A1E',
    accountScopeBg: '#EDF4E6',
    accountScopeBorder: '#A9C77E',
    depositBg: '#F3F7E4',
    gainText: '#316A26',
    gainSoftBg: '#E4F2D9',
    alert: '#E5484D',
    alertText: '#A83A21',
    alertSoftBg: '#FDECEC',
    withdrawalText: '#D9480F',
    walletSavings: '#2A9D8F',
    walletSpending: '#90BE6D',
    walletGoodDeeds: '#E76F51',
    walletTrack: '#E8EFDC',
    chartSavings: '#2A9D8F',
    chartSpending: '#6E9B22',
    chartGoodDeeds: '#E76F51',
  },
  gradients: themeGradients(GRADIENT_STOPS),
  shadows: SHADOW_SCALE,
  tints: TINT_SCALE,
  typography: TYPE_SCALE,
};
