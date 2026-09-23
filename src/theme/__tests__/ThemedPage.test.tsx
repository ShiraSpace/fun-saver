import { render, screen } from '@testing-library/react';
import { ThemeDisplay, THEME_ID_TESTID } from '@/test-utils/theme-probe';
import { ThemedPage } from '../ThemedPage';
import { THEME_ID } from '../registry';

describe('ThemedPage', () => {
  beforeEach(() => {
    render(
      <ThemedPage themeId={THEME_ID.midnightBlue}>
        <ThemeDisplay />
      </ThemedPage>
    );
  });

  it('renders its children inside the page main landmark', () => {
    expect(screen.getByRole('main')).toContainElement(
      screen.getByTestId(THEME_ID_TESTID)
    );
  });

  it('hands the given theme id to the controller', () => {
    expect(screen.getByTestId(THEME_ID_TESTID)).toHaveTextContent(
      THEME_ID.midnightBlue
    );
  });
});
