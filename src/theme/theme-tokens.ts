import type { ThemeShadows } from './shadows';
import type { ThemeTints } from './tints';
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
  readonly labelShade: string;
  readonly selectionRing: string;
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
  readonly chartSavings: string;
  readonly chartSpending: string;
  readonly chartGood: string;
}

export interface ThemeStops {
  readonly screen: readonly [string, string, string];
  readonly primaryButton: readonly [string, string];
  readonly sunnyTile: readonly [string, string];
  readonly potSavings: readonly [string, string];
  readonly potSpending: readonly [string, string];
  readonly potGood: readonly [string, string];
}

export interface ThemeGradients {
  readonly screen: string;
  readonly primaryButton: string;
  readonly sunnyTile: string;
  readonly potSavings: string;
  readonly potSpending: string;
  readonly potGood: string;
}

export interface ThemeTokens {
  readonly colors: ThemeColors;
  readonly gradients: ThemeGradients;
  readonly shadows: ThemeShadows;
  readonly tints: ThemeTints;
  readonly typography: ThemeTypography;
}

declare module '@emotion/react' {
  export interface Theme {
    readonly colors: ThemeColors;
    readonly gradients: ThemeGradients;
    readonly shadows: ThemeShadows;
    readonly tints: ThemeTints;
    readonly typography: ThemeTypography;
  }
}
