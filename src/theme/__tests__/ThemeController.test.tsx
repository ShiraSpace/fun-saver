import { JSX } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeController, useThemeId, useSetThemeId } from '../ThemeController';
import type { ThemeId } from '../registry';

function ThemeDisplay(): JSX.Element {
  const id = useThemeId();
  return <span data-testid="theme-id">{id}</span>;
}

function ThemeSwitcher({ targetId }: { targetId: ThemeId }): JSX.Element {
  const set = useSetThemeId();
  return <button onClick={() => set(targetId)}>switch</button>;
}

describe('ThemeController', () => {
  it('exposes the initial theme id', () => {
    render(
      <ThemeController initialThemeId="jungle-quest">
        <ThemeDisplay />
      </ThemeController>,
    );
    expect(screen.getByTestId('theme-id')).toHaveTextContent('jungle-quest');
  });

  it('updates the theme id and writes the cookie on set', () => {
    render(
      <ThemeController initialThemeId="jungle-quest">
        <ThemeDisplay />
        <ThemeSwitcher targetId="midnight-blue" />
      </ThemeController>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'switch' }));
    expect(screen.getByTestId('theme-id')).toHaveTextContent('midnight-blue');
    expect(document.cookie).toContain('fs-theme=midnight-blue');
  });
});
