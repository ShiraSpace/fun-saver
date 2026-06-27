import type { ThemeTypography } from './typography';

export interface ThemeColors {
  readonly primary: string;
  readonly primaryGradientTop: string;
  readonly primaryShadow: string;
  readonly primaryGlow: string;
  readonly textOnPrimary: string;
  readonly surface: string;
  readonly textMuted: string;
  readonly textStrong: string;
  readonly screenGradientStart: string;
  readonly screenGradientMid: string;
  readonly screenGradientEnd: string;
  readonly accent: string;
  readonly accentSoft: string;
  readonly star: string;
  readonly divider: string;
  readonly softBg: string;
  readonly softBorder: string;
  readonly softText: string;
  readonly depositBg: string;
  readonly gainText: string;
  readonly gainSoftBg: string;
}

export interface ThemeGradients {
  readonly screen: string;
  readonly actionButton: string;
  readonly sunnyTile: string;
  readonly potSavings: string;
  readonly potSpending: string;
  readonly potGood: string;
}

export interface ThemeTokens {
  readonly colors: ThemeColors;
  readonly gradients: ThemeGradients;
  readonly typography: ThemeTypography;
}

declare module '@emotion/react' {
  export interface Theme {
    readonly colors: ThemeColors;
    readonly gradients: ThemeGradients;
    readonly typography: ThemeTypography;
  }
}
