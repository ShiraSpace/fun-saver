import type { AccountSummary } from '@/lib/account/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { shekelsToAgorot } from '@/lib/money';
import { render, screen } from '@/test-utils/render';
import {
  mockAccountSummary,
  mockAccountsContext,
  mockSiblingAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { createMockGoal, mockAccountWithGoalReached } from '@/test-utils/mocks/goal.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { COINS_IN_HALF_A_PILE, coinsDrawnInPile } from '@/test-utils/coin-pile';
import { CELEBRATION_TEST_IDS } from '@/components/Goal/Celebration/constants';
import { ChildAccount } from './ChildAccount';
import { CHILD_ACCOUNT_TEST_IDS } from './constants';
import { CHILD_SAVINGS_TEST_IDS } from './ChildSavings/constants';
import { CHILD_WALLET_TEST_IDS } from './ChildWallet/constants';
import { INTEREST_COIN_BUTTON_TEST_IDS } from './ChildSavings/InterestCoins/InterestCoinButton/constants';

describe('ChildAccount', () => {
  beforeEach(() => {
    render(<ChildAccount account={mockAccountSummary} />, {
      accounts: mockAccountsContext,
      user: mockUser,
      collectedInterest: { [mockAccountSummary.id]: '0' },
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

  it('offers the child nothing to press but the coins', () => {
    const pressable = screen
      .getByTestId(CHILD_ACCOUNT_TEST_IDS.wallets)
      .querySelectorAll('button, a');

    expect([...pressable].map((element) => element.getAttribute('data-testid'))).toEqual(
      Array(3).fill(INTEREST_COIN_BUTTON_TEST_IDS.coin)
    );
  });
});

describe('ChildAccount saving ₪5 toward a ₪10 goal', () => {
  beforeEach(() => {
    const mockAccountSavingFiveOfTen: AccountSummary = {
      ...mockAccountSummary,
      wallets: mockAccountSummary.wallets.map((wallet) =>
        wallet.name === WALLET_NAMES.savings
          ? { ...wallet, balance: shekelsToAgorot(5), interestEarned: 0 }
          : wallet
      ),
      goal: createMockGoal({ amount: shekelsToAgorot(10) }),
    };

    render(<ChildAccount account={mockAccountSavingFiveOfTen} />, {
      accounts: mockAccountsContext,
      user: mockUser,
    });
  });

  it('hands the savings card the goal, so the piggy bank is half full', () => {
    expect(coinsDrawnInPile()).toBe(COINS_IN_HALF_A_PILE);
  });
});

it("shows a sibling's own coins after a switch, not the first child's", () => {
  const mockSiblingWithThreeShekelsOfInterest: AccountSummary = {
    ...mockSiblingAccountSummary,
    wallets: [createMockWalletSummary({ id: 'w4', balance: 4200, interestEarned: 300 })],
  };
  const { rerender } = render(<ChildAccount account={mockAccountSummary} />, {
    accounts: mockAccountsContext,
    user: mockUser,
    collectedInterest: {
      [mockAccountSummary.id]: '0',
      [mockSiblingWithThreeShekelsOfInterest.id]: '0',
    },
  });

  rerender(<ChildAccount account={mockSiblingWithThreeShekelsOfInterest} />);

  expect(
    screen.getAllByTestId(INTEREST_COIN_BUTTON_TEST_IDS.amount).map((amount) => amount.textContent)
  ).toEqual(['₪1', '₪1', '₪1']);
});

describe('ChildAccount with its goal reached', () => {
  let view: ReturnType<typeof render>;
  let celebrationBefore: HTMLElement;

  beforeEach(() => {
    view = render(<ChildAccount account={mockAccountWithGoalReached} />, {
      accounts: mockAccountsContext,
      user: mockUser,
    });
    celebrationBefore = screen.getByTestId(CELEBRATION_TEST_IDS.celebration);
  });

  it('plays the celebration again when another account with its goal reached is shown', () => {
    view.rerender(<ChildAccount account={{ ...mockAccountWithGoalReached, id: 'account-2' }} />);

    expect(screen.getByTestId(CELEBRATION_TEST_IDS.celebration)).not.toBe(celebrationBefore);
  });

  it('does not play the celebration again when the same account is refreshed', () => {
    view.rerender(<ChildAccount account={{ ...mockAccountWithGoalReached }} />);

    expect(screen.getByTestId(CELEBRATION_TEST_IDS.celebration)).toBe(celebrationBefore);
  });
});
