import { THEME_COOKIE } from '@/lib/cookies';
import { DEFAULT_THEME_ID, THEMES } from './registry';
import type { ThemeTokens } from './theme-tokens';

const TOKEN_GROUPS = [
  ['colors', 'color'],
  ['gradients', 'gradient'],
  ['shadows', 'shadow'],
  ['tints', 'tint'],
] as const;

const tokensOf = (theme: ThemeTokens): string =>
  TOKEN_GROUPS.flatMap(([group, prefix]) =>
    Object.entries(theme[group]).map(
      ([name, value]) => `--fs-${prefix}-${name}:${value}`
    )
  ).join(';');

const scopeFor = (id: string): string =>
  id === DEFAULT_THEME_ID
    ? `:root,:root[data-theme='${id}']`
    : `:root[data-theme='${id}']`;

export function everyThemeAsCss(): string {
  return Object.entries(THEMES)
    .map(([id, theme]) => `${scopeFor(id)}{${tokensOf(theme)}}`)
    .join('');
}

export function applyStoredThemeScript(): string {
  const knownThemes = JSON.stringify(Object.keys(THEMES));

  return `try{var c=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);var t=c&&${knownThemes}.indexOf(c[1])>=0?c[1]:'${DEFAULT_THEME_ID}';document.documentElement.dataset.theme=t}catch(e){}`;
}
