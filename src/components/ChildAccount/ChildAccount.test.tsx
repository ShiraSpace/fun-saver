import { render, screen } from '@/test-utils/render';
import {
  mockAccountSummary,
  mockAccountsContext,
} from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { ChildAccount } from './ChildAccount';
import { CHILD_ACCOUNT_TEST_IDS } from './constants';
import { CHILD_SAVINGS_TEST_IDS } from './ChildSavings/constants';
import { CHILD_WALLET_TEST_IDS } from './ChildWallet/constants';

describe('ChildAccount', () => {
  beforeEach(() => {
    render(<ChildAccount account={mockAccountSummary} />, {
      accounts: mockAccountsContext,
      user: mockUser,
    });
  });

  it('puts savings first', () => {
    const savings = screen.getByTestId(CHILD_SAVINGS_TEST_IDS.card);
    const [firstWallet] = screen.getAllByTestId(CHILD_WALLET_TEST_IDS.card);

    expect(
      savings.compareDocumentPosition(firstWallet) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('shows spending and good deeds', () => {
    expect(screen.getAllByTestId(CHILD_WALLET_TEST_IDS.card)).toHaveLength(2);
  });

  it('shows the child screen', () => {
    expect(
      screen.getByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
    ).toBeInTheDocument();
  });

  it('offers the child nothing to do but look', () => {
    expect(screen.queryByTestId(ACCOUNT_TEST_IDS.newTransaction)).toBeNull();
  });
});
