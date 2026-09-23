import {
  DEFAULT_THEME_ID,
  THEMES,
  getThemeTokens,
  resolveThemeId,
} from '../registry';

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
      'star',
      'divider',
      'softBg',
      'softBorder',
      'softText',
      'accountScopeBg',
      'accountScopeBorder',
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

  it('gives every theme a colour for each contrast token', () => {
    const contrastTokens = Object.values(THEMES).map(({ colors }) => [
      colors.primaryText,
      colors.textOnPot,
      colors.labelScrim,
      colors.alertText,
      colors.selectionRing,
    ]);

    expect(contrastTokens).toEqual([
      ['#6B2C8E', '#2B1235', 'rgba(0, 0, 0, 0.45)', '#A81B3A', '#2B1235'],
      ['#1B7A6B', '#2B1800', 'rgba(0, 0, 0, 0.35)', '#A83A21', '#2B1800'],
      ['#3B82F6', '#ECF1F8', 'transparent', '#F87171', '#3B82F6'],
    ]);
  });

  it('pins the muted and gain values every theme reads', () => {
    const readableOnTints = Object.values(THEMES).map(({ colors }) => [
      colors.textMuted,
      colors.gainText,
    ]);

    expect(readableOnTints).toEqual([
      ['#675A80', '#276E2C'],
      ['#4B655B', '#316A26'],
      ['#8A96A8', '#34D399'],
    ]);
  });

  it('drops the button shadow below the button on every theme', () => {
    const buttonTokens = Object.values(THEMES).map(({ colors, gradients }) => [
      gradients.actionButton,
      colors.primaryShadow,
      colors.primaryGlow,
    ]);

    expect(buttonTokens).toEqual([
      [
        'linear-gradient(#8A3AAE, #6B2C8E)',
        '#4A1A6E',
        'rgba(107, 44, 142, 0.45)',
      ],
      [
        'linear-gradient(#1B7A6B, #12564B)',
        '#0B3A33',
        'rgba(27, 122, 107, 0.45)',
      ],
      [
        'linear-gradient(#1D4ED8, #1E3A8A)',
        '#152A63',
        'rgba(29, 78, 216, 0.40)',
      ],
    ]);
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
