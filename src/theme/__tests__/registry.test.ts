import { DEFAULT_THEME_ID, getThemeTokens, resolveThemeId } from '../registry';

describe('theme registry', () => {
  it('resolves the default theme when no id is given', () => {
    expect(getThemeTokens()).toBe(getThemeTokens(DEFAULT_THEME_ID));
  });

  it('exposes the sunset colours and gradients as tokens', () => {
    const tokens = getThemeTokens(DEFAULT_THEME_ID);

    expect(tokens.colors.primary).toBe('#6B2C8E');
    expect(tokens.gradients.actionButton).toContain('linear-gradient');
    expect(tokens.gradients.screen).toContain('linear-gradient');
  });

  it('throws on an unknown theme id', () => {
    expect(() => getThemeTokens('does-not-exist')).toThrow();
  });

  it('exposes the full cohesive token set for the default theme', () => {
    const { colors, gradients } = getThemeTokens(DEFAULT_THEME_ID);
    for (const key of [
      'accent',
      'accentSoft',
      'star',
      'divider',
      'softBg',
      'softBorder',
      'softText',
      'depositBg',
      'gainText',
      'gainSoftBg',
    ] as const) {
      expect(colors[key]).toMatch(/^#|rgb/);
    }
    for (const key of ['potSavings', 'potSpending', 'potGood'] as const) {
      expect(gradients[key]).toContain('linear-gradient');
    }
  });

  it('resolves jungle-quest with full tokens', () => {
    const t = getThemeTokens('jungle-quest');
    expect(t.colors.primary).toBe('#2A9D8F');
    expect(t.colors.surface).toBe('#FFFDF5');
    expect(t.gradients.potGood).toContain('linear-gradient');
  });

  it('resolves midnight-blue with full tokens', () => {
    const t = getThemeTokens('midnight-blue');
    expect(t.colors.primary).toBe('#3B82F6');
    expect(t.colors.surface).toBe('#141B24');
  });

  describe('resolveThemeId', () => {
    it('keeps a known theme id', () => {
      expect(resolveThemeId('jungle-quest')).toBe('jungle-quest');
    });

    it('falls back to the default for an unknown id', () => {
      expect(resolveThemeId('does-not-exist')).toBe(DEFAULT_THEME_ID);
    });

    it('falls back to the default when the id is missing', () => {
      expect(resolveThemeId(undefined)).toBe(DEFAULT_THEME_ID);
    });
  });
});
