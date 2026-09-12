import { render, screen } from '@/test-support/render';
import { EmptyState } from './EmptyState';
import { EMPTY_STATE_COPY, EMPTY_STATE_TEST_IDS } from './constants';

describe('EmptyState', () => {
  beforeEach(() => {
    render(<EmptyState onCreate={() => {}} />);
  });

  it('renders the empty-state screen', () => {
    expect(
      screen.getByTestId(EMPTY_STATE_TEST_IDS.container)
    ).toBeInTheDocument();
  });

  it('shows the pig', () => {
    expect(screen.getByTestId(EMPTY_STATE_TEST_IDS.pig)).toHaveTextContent(
      EMPTY_STATE_COPY.pig
    );
  });

  it('shows a create-account button labelled צור חשבון', () => {
    expect(
      screen.getByTestId(EMPTY_STATE_TEST_IDS.createAccount)
    ).toHaveTextContent(EMPTY_STATE_COPY.createAccount);
  });
});
