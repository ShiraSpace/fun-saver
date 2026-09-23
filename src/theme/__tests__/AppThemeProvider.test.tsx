import { JSX } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeDisplay, THEME_ID_TESTID } from '@/test-utils/theme-probe';
import { AppThemeProvider, useSetThemeId } from '../AppThemeProvider';
import { THEME_ID, type ThemeId } from '../registry';
import { missingProviderMessage } from '@/hooks/create-required-context';

function ThemeSwitcher({ targetId }: { targetId: ThemeId }): JSX.Element {
  const set = useSetThemeId();
  return <button onClick={() => set(targetId)}>switch</button>;
}

describe('AppThemeProvider', () => {
  it('exposes the initial theme id', () => {
    render(
      <AppThemeProvider initialThemeId={THEME_ID.jungleQuest}>
        <ThemeDisplay />
      </AppThemeProvider>
    );
    expect(screen.getByTestId(THEME_ID_TESTID)).toHaveTextContent(
      THEME_ID.jungleQuest
    );
  });

  it('updates the active theme id on set', () => {
    render(
      <AppThemeProvider initialThemeId={THEME_ID.jungleQuest}>
        <ThemeDisplay />
        <ThemeSwitcher targetId={THEME_ID.midnightBlue} />
      </AppThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'switch' }));
    expect(screen.getByTestId(THEME_ID_TESTID)).toHaveTextContent(
      THEME_ID.midnightBlue
    );
  });

  describe('naming the theme on the document, for screens with no provider', () => {
    beforeEach(() => {
      delete document.documentElement.dataset.theme;

      render(
        <AppThemeProvider initialThemeId={THEME_ID.jungleQuest}>
          <ThemeSwitcher targetId={THEME_ID.midnightBlue} />
        </AppThemeProvider>
      );
    });

    it('names the theme it starts on', () => {
      expect(document.documentElement.dataset.theme).toBe(THEME_ID.jungleQuest);
    });

    it('renames it when the theme changes', () => {
      fireEvent.click(screen.getByRole('button', { name: 'switch' }));

      expect(document.documentElement.dataset.theme).toBe(
        THEME_ID.midnightBlue
      );
    });
  });

  describe('with no AppThemeProvider above', () => {
    it('refuses to name a theme', () => {
      expect(() => render(<ThemeDisplay />)).toThrow(
        missingProviderMessage('AppThemeProvider')
      );
    });

    it('refuses to switch the theme', () => {
      expect(() =>
        render(<ThemeSwitcher targetId={THEME_ID.midnightBlue} />)
      ).toThrow(missingProviderMessage('AppThemeProvider'));
    });
  });
});
