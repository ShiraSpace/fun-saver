import { render, screen } from '@testing-library/react';
import { LoadingShell } from './LoadingShell';
import { LOADING_SHELL_CONTENT, LOADING_SHELL_TEST_IDS } from './constants';

describe('LoadingShell', () => {
  beforeEach(() => {
    render(<LoadingShell />);
  });

  it('renders with no theme provider above it, where the root layout puts it', () => {
    expect(
      screen.getByTestId(LOADING_SHELL_TEST_IDS.shell)
    ).toHaveAccessibleName(LOADING_SHELL_CONTENT.label);
  });
});
