import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { EMPTY_STATE_COPY, EMPTY_STATE_TEST_IDS } from './constants';

describe('EmptyState', () => {
  beforeEach(() => {
    render(<EmptyState />);
  });

  it('renders the empty-state screen', () => {
    expect(
      screen.getByTestId(EMPTY_STATE_TEST_IDS.container)
    ).toBeInTheDocument();
  });

  it('shows the brand emoji', () => {
    expect(screen.getByTestId(EMPTY_STATE_TEST_IDS.brand)).toHaveTextContent(
      EMPTY_STATE_COPY.brandEmoji
    );
  });

  it('shows a create-account button labelled צור חשבון', () => {
    expect(
      screen.getByTestId(EMPTY_STATE_TEST_IDS.createAccount)
    ).toHaveTextContent(EMPTY_STATE_COPY.createAccount);
  });
});
