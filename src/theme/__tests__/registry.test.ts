import { DEFAULT_THEME_ID, getThemeTokens } from '../registry';

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
});
