import { THEME_COOKIE } from '@/lib/cookies';
import { DEFAULT_THEME_ID, THEMES } from './registry';
import type { ThemeTokens } from './theme-tokens';

const TOKEN_GROUPS = ['colors', 'gradients', 'shadows', 'tints'] as const;

type TokenGroup = (typeof TOKEN_GROUPS)[number];

const PREFIX_OF = {
  colors: 'color',
  gradients: 'gradient',
  shadows: 'shadow',
  tints: 'tint',
} satisfies Record<TokenGroup, string>;

const customProperty = (prefix: string, name: string): string =>
  `--fs-${prefix}-${name}`;

const tokensOf = (theme: ThemeTokens): string =>
  TOKEN_GROUPS.flatMap((group) =>
    Object.entries(theme[group]).map(
      ([name, value]) => `${customProperty(PREFIX_OF[group], name)}:${value}`
    )
  ).join(';');

export function themeVar<Group extends TokenGroup>(
  group: Group,
  name: keyof ThemeTokens[Group] & string
): string {
  return `var(${customProperty(PREFIX_OF[group], name)})`;
}

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
