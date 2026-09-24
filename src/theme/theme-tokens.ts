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
  readonly textOnWallet: string;
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
  readonly withdrawalText: string;
  readonly walletSavings: string;
  readonly walletSpending: string;
  readonly walletGoodDeeds: string;
  readonly walletTrack: string;
  readonly chartSavings: string;
  readonly chartSpending: string;
  readonly chartGoodDeeds: string;
}

export interface ThemeGradientStops {
  readonly screen: readonly [string, string, string];
  readonly primaryButton: readonly [string, string];
  readonly avatarBadge: readonly [string, string];
  readonly walletSavings: readonly [string, string];
  readonly walletSpending: readonly [string, string];
  readonly walletGoodDeeds: readonly [string, string];
}

export interface ThemeGradients {
  readonly screen: string;
  readonly primaryButton: string;
  readonly avatarBadge: string;
  readonly walletSavings: string;
  readonly walletSpending: string;
  readonly walletGoodDeeds: string;
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
