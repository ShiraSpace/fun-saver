import { buildGradients } from '../gradients';
import { SHADOW_SCALE } from '../shadows';
import { TINT_SCALE } from '../tints';
import { TYPE_SCALE } from '../typography';
import type { ThemeStops, ThemeTokens } from '../theme-tokens';

const STOPS = {
  screen: ['#0A0E14', '#0F1620', '#122036'],
  actionButton: ['#1D4ED8', '#1E3A8A'],
  sunnyTile: ['#1E40AF', '#172554'],
  potSavings: ['#1E40AF', '#172554'],
  potSpending: ['#2563EB', '#1E40AF'],
  potGood: ['#4338CA', '#312E81'],
} as const satisfies ThemeStops;

export const midnightBlue: ThemeTokens = {
  colors: {
    primary: '#3B82F6',
    primaryText: '#3B82F6',
    primaryShadow: '#152A63',
    primaryGlow: 'rgba(29, 78, 216, 0.40)',
    textOnPrimary: '#FFFFFF',
    surface: '#141B24',
    textMuted: '#8A96A8',
    textStrong: '#ECF1F8',
    textOnPot: '#ECF1F8',
    labelShade: 'transparent',
    selectionRing: '#3B82F6',
    star: '#93C5FD',
    divider: '#1E2A40',
    softBg: '#121E36',
    softBorder: '#3B82F6',
    softText: '#93C5FD',
    accountScopeBg: '#101A2C',
    accountScopeBorder: '#2F4470',
    depositBg: '#111B30',
    gainText: '#34D399',
    gainSoftBg: '#0E2E2A',
    alert: '#F87171',
    alertText: '#F87171',
    alertSoftBg: '#3A1518',
    withdrawText: '#FB923C',
    walletSavings: '#1E40AF',
    walletSpending: '#60A5FA',
    walletGood: '#818CF8',
    walletTrack: '#1E2A40',
    chartSavings: '#60A5FA',
    chartSpending: '#38BDF8',
    chartGood: '#A78BFA',
  },
  gradients: buildGradients(STOPS),
  shadows: SHADOW_SCALE,
  tints: TINT_SCALE,
  typography: TYPE_SCALE,
};
