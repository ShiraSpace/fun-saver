import { fireEvent, render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { WithdrawalForm } from './WithdrawalForm';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from './constants';
import { LOCKED_SAVINGS_TEST_IDS } from './LockedSavings/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { WALLET_PICKER_TEST_IDS } from '../WalletPicker/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '../AmountKeypad/constants';

jest.mock('../use-add-transaction', () => ({
  useAddTransaction: (): {
    addDeposit: jest.Mock;
    addWithdrawal: jest.Mock;
  } => ({
    addDeposit: jest.fn(),
    addWithdrawal: jest.fn(),
  }),
}));

const [savings] = mockWalletSummaries;
const mockAccountSavingForGoal = {
  ...mockAccountSummary,
  goal: createMockGoal({ amount: savings.balance + 100 }),
};

function type(...digits: string[]): void {
  for (const digit of digits) {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key(digit)));
  }
}

function pickSavings(): void {
  fireEvent.click(
    screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(savings.name))
  );
}

describe('WithdrawalForm with a goal', () => {
  describe('not yet reached, with savings picked', () => {
    beforeEach(() => {
      render(
        <WithdrawalForm
          account={mockAccountSavingForGoal}
          onClose={jest.fn()}
        />
      );
      type('5');
      pickSavings();
    });

    it('shows the goal in place of the keypad', () => {
      expect(
        screen.getByTestId(LOCKED_SAVINGS_TEST_IDS.panel)
      ).toBeInTheDocument();
    });

    it('hides the keypad', () => {
      expect(
        screen.queryByTestId(AMOUNT_KEYPAD_TEST_IDS.key('1'))
      ).not.toBeInTheDocument();
    });

    it('says on the submit that savings are kept', () => {
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
      ).toHaveTextContent(WITHDRAWAL_FORM_COPY.savingsLockedSubmit);
    });

    it('keeps the submit disabled', () => {
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
      ).toBeDisabled();
    });
  });

  it('shows no overdraft alert over a locked goal', () => {
    render(
      <WithdrawalForm account={mockAccountSavingForGoal} onClose={jest.fn()} />
    );
    type('9', '9');
    pickSavings();

    expect(
      screen.queryByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)
    ).not.toBeInTheDocument();
  });

  it('warns that withdrawing savings completes a reached goal', () => {
    render(
      <WithdrawalForm
        account={{
          ...mockAccountSummary,
          goal: createMockGoal({ amount: savings.balance }),
        }}
        onClose={jest.fn()}
      />
    );
    pickSavings();

    expect(
      screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.completesGoal)
    ).toBeInTheDocument();
  });
});
