import type { ThemeTypography } from './typography';

export interface ThemeColors {
  readonly primary: string;
  readonly primaryText: string;
  readonly primaryShadow: string;
  readonly primaryGlow: string;
  readonly textOnPrimary: string;
  readonly surface: string;
  readonly textMuted: string;
  readonly textStrong: string;
  readonly textOnPot: string;
  readonly labelScrim: string;
  readonly selectionRing: string;
  readonly screenGradientStart: string;
  readonly screenGradientMid: string;
  readonly screenGradientEnd: string;
  readonly star: string;
  readonly divider: string;
  readonly softBg: string;
  readonly softBorder: string;
  readonly softText: string;
  readonly accountScopeBg: string;
  readonly accountScopeBorder: string;
  readonly depositBg: string;
  readonly gainText: string;
  readonly gainSoftBg: string;
  readonly alert: string;
  readonly alertText: string;
  readonly alertSoftBg: string;
  readonly withdrawText: string;
  readonly walletSavings: string;
  readonly walletSpending: string;
  readonly walletGood: string;
  readonly walletTrack: string;
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
