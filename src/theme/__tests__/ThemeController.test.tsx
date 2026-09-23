import { JSX } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeDisplay, THEME_ID_TESTID } from '@/test-utils/theme-probe';
import { ThemeController, useSetThemeId } from '../ThemeController';
import { THEME_ID, type ThemeId } from '../registry';

function ThemeSwitcher({ targetId }: { targetId: ThemeId }): JSX.Element {
  const set = useSetThemeId();
  return <button onClick={() => set(targetId)}>switch</button>;
}

describe('ThemeController', () => {
  it('exposes the initial theme id', () => {
    render(
      <ThemeController initialThemeId={THEME_ID.jungleQuest}>
        <ThemeDisplay />
      </ThemeController>
    );
    expect(screen.getByTestId(THEME_ID_TESTID)).toHaveTextContent(
      THEME_ID.jungleQuest
    );
  });

  it('updates the active theme id on set', () => {
    render(
      <ThemeController initialThemeId={THEME_ID.jungleQuest}>
        <ThemeDisplay />
        <ThemeSwitcher targetId={THEME_ID.midnightBlue} />
      </ThemeController>
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
        <ThemeController initialThemeId={THEME_ID.jungleQuest}>
          <ThemeSwitcher targetId={THEME_ID.midnightBlue} />
        </ThemeController>
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
});
