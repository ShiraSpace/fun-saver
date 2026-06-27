import { DEFAULT_THEME_ID } from '@/theme/registry';
import { resolveThemeId } from '../theme-cookie';

it('passes through a known id', () => {
  expect(resolveThemeId('jungle-quest')).toBe('jungle-quest');
});

it('falls back for unknown/missing', () => {
  expect(resolveThemeId('nope')).toBe(DEFAULT_THEME_ID);
  expect(resolveThemeId(undefined)).toBe(DEFAULT_THEME_ID);
});
