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
}

export interface ThemeGradients {
  readonly screen: string;
  readonly actionButton: string;
  readonly sunnyTile: string;
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
