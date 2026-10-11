import { render, screen } from '@/test-utils/render';
import { mockAccountSummary, mockAccountsContext } from '@/test-utils/mocks/account.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import type { AccountSummary } from '@/lib/account/types';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { ChildAccount } from './ChildAccount';
import { CHILD_ACCOUNT_TEST_IDS } from './constants';
import { CHILD_SAVINGS_TEST_IDS } from './ChildSavings/constants';
import { CHILD_WALLET_TEST_IDS } from './ChildWallet/constants';
import { COIN_PILE_SPOTS } from './ChildSavings/PiggyBank/coin-pile';
import { COIN_PILE_TEST_IDS } from './ChildSavings/PiggyBank/CoinPile/constants';

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
      savings.compareDocumentPosition(firstWallet) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('shows spending and good deeds', () => {
    expect(screen.getAllByTestId(CHILD_WALLET_TEST_IDS.card)).toHaveLength(2);
  });

  it('shows the child screen', () => {
    expect(screen.getByTestId(CHILD_ACCOUNT_TEST_IDS.screen)).toBeInTheDocument();
  });

  it('offers the child nothing to do but look', () => {
    expect(
      screen.getByTestId(CHILD_ACCOUNT_TEST_IDS.wallets).querySelectorAll('button, a')
    ).toHaveLength(0);
  });
});

describe('ChildAccount saving ₪5 toward a ₪10 goal', () => {
  beforeEach(() => {
    const mockAccountSavingFiveOfTen: AccountSummary = {
      ...mockAccountSummary,
      wallets: mockAccountSummary.wallets.map((wallet) =>
        wallet.name === WALLET_NAMES.savings
          ? { ...wallet, balance: 500, interestEarned: 0 }
          : wallet
      ),
      goal: createMockGoal({ amount: 1000 }),
    };

    render(<ChildAccount account={mockAccountSavingFiveOfTen} />, {
      accounts: mockAccountsContext,
      user: mockUser,
    });
  });

  it('hands the savings card the goal, so the piggy bank is half full', () => {
    const halfThePile = Math.round(COIN_PILE_SPOTS.length / 2);

    expect(screen.queryAllByTestId(COIN_PILE_TEST_IDS.coin)).toHaveLength(halfThePile);
  });
});
