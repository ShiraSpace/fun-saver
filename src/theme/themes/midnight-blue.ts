import { TYPE_SCALE } from '../typography';
import type { ThemeTokens } from '../theme-tokens';

export const midnightBlue: ThemeTokens = {
  colors: {
    primary: '#3B82F6',
    primaryGradientTop: '#60A5FA',
    primaryShadow: '#1E40AF',
    primaryGlow: 'rgba(59, 130, 246, 0.40)',
    textOnPrimary: '#FFFFFF',
    surface: '#141B24',
    textMuted: '#8A96A8',
    textStrong: '#ECF1F8',
    screenGradientStart: '#0A0E14',
    screenGradientMid: '#0F1620',
    screenGradientEnd: '#122036',
    accent: '#3B82F6',
    accentSoft: '#14213F',
    star: '#93C5FD',
    divider: '#1E2A40',
    softBg: '#121E36',
    softBorder: '#3B82F6',
    softText: '#93C5FD',
    depositBg: '#111B30',
    gainText: '#34D399',
    gainSoftBg: '#0E2E2A',
  },
  gradients: {
    screen: 'linear-gradient(160deg, #0A0E14, #0F1620, #122036)',
    actionButton: 'linear-gradient(#60A5FA, #3B82F6)',
    sunnyTile: 'linear-gradient(135deg, #1E40AF, #172554)',
    potSavings: 'linear-gradient(135deg, #1E40AF, #172554)',
    potSpending: 'linear-gradient(135deg, #2563EB, #1E40AF)',
    potGood: 'linear-gradient(135deg, #4338CA, #312E81)',
  },
  typography: TYPE_SCALE,
};
