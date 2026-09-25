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
  colors: {
    primary: '#6B2C8E',
    primaryText: '#6B2C8E',
    primaryShadow: '#4A1A6E',
    primaryGlow: 'rgba(107, 44, 142, 0.45)',
    textOnPrimary: '#FFFFFF',
    surface: '#FFFFFF',
    textMuted: '#675A80',
    textStrong: '#3A1F5A',
    textOnWallet: '#2B1235',
    labelShade: 'rgba(0, 0, 0, 0.45)',
    selectionRing: '#2B1235',
    star: '#FFD23F',
    divider: '#F2D9D2',
    softBg: '#FFF8E0',
    softBorder: '#FFD23F',
    softText: '#7A5A0A',
    accountScopeBg: '#F4EEFA',
    accountScopeBorder: '#C9B6E4',
    depositBg: '#FFF6E0',
    gainText: '#276E2C',
    gainSoftBg: '#E1F4E5',
    alert: '#E5484D',
    alertText: '#A81B3A',
    alertSoftBg: '#FDECEC',
    withdrawalText: '#D9480F',
    walletSavings: '#FFC34D',
    walletSpending: '#FF8A4C',
    walletGoodDeeds: '#E94E89',
    walletTrack: '#F3ECE4',
    chartSavings: '#276E2C',
    chartSpending: '#2563EB',
    chartGoodDeeds: '#E94E89',
    chartTotalBalanceFill: 'rgba(58, 31, 90, 0.07)',
  },
  gradients: themeGradients(GRADIENT_STOPS),
  shadows: SHADOW_SCALE,
  tints: TINT_SCALE,
  typography: TYPE_SCALE,
};
