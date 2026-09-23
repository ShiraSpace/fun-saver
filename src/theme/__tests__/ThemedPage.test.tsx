import { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemedPage } from '../ThemedPage';
import { useThemeId } from '../ThemeController';

function ThemeDisplay(): JSX.Element {
  const id = useThemeId();
  return <span data-testid="theme-id">{id}</span>;
}

describe('ThemedPage', () => {
  beforeEach(() => {
    render(
      <ThemedPage themeId="midnight-blue">
        <ThemeDisplay />
      </ThemedPage>
    );
  });

  it('renders its children inside the page main landmark', () => {
    expect(screen.getByRole('main')).toContainElement(
      screen.getByTestId('theme-id')
    );
  });

  it('hands the given theme id to the controller', () => {
    expect(screen.getByTestId('theme-id')).toHaveTextContent('midnight-blue');
  });
});
