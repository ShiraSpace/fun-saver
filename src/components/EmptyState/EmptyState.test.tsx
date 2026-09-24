import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { PIG_EMOJI } from '@/components/Pig/constants';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { HEADER_TITLE_TEST_IDS } from '@/components/Header/HeaderTitle/constants';
import { SIGNED_IN_USER_SECTION_TEST_IDS } from '@/components/Menu/SignedInUserSection/constants';
import { EmptyState } from './EmptyState';
import { EMPTY_STATE_COPY, EMPTY_STATE_TEST_IDS } from './constants';

const mockGreeting = 'שלום';

describe('EmptyState', () => {
  beforeEach(() => {
    render(<EmptyState onCreate={() => {}} />, { user: mockUser });
  });

  it('renders the empty-state screen', () => {
    expect(
      screen.getByTestId(EMPTY_STATE_TEST_IDS.container)
    ).toBeInTheDocument();
  });

  it('shows the pig', () => {
    expect(screen.getByTestId(EMPTY_STATE_TEST_IDS.pig)).toHaveTextContent(
      PIG_EMOJI
    );
  });

  it('shows a create-account button labelled צור חשבון', () => {
    expect(
      screen.getByTestId(EMPTY_STATE_TEST_IDS.createAccount)
    ).toHaveTextContent(EMPTY_STATE_COPY.createAccount);
  });

  it('carries the header, so the burger sits where it does on every screen', () => {
    expect(screen.getByTestId(HEADER_TEST_IDS.bar)).toBeInTheDocument();
  });

  it('greets the parent where an account screen would name the account', () => {
    expect(screen.getByTestId(HEADER_TITLE_TEST_IDS.title)).toHaveTextContent(
      mockGreeting
    );
  });

  it('offers the way out of the app that a stranger used to be denied', () => {
    expect(
      screen.getByTestId(SIGNED_IN_USER_SECTION_TEST_IDS.signOut)
    ).toBeInTheDocument();
  });
});
