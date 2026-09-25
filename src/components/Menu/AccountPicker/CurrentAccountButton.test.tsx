import { fireEvent, render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { totalBalance } from '@/lib/wallet/balance';
import { agorotToWholeShekels } from '@/lib/money';
import { CurrentAccountButton } from './CurrentAccountButton';
import { ACCOUNT_PICKER_COPY, ACCOUNT_PICKER_TEST_IDS } from './constants';

const mockOnToggle = jest.fn();

function renderTrigger(isOpen: boolean): void {
  render(
    <CurrentAccountButton
      account={mockAccountSummary}
      isOpen={isOpen}
      onToggle={mockOnToggle}
    />
  );
}

describe('CurrentAccountButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('while the account list is closed', () => {
    beforeEach(() => {
      renderTrigger(false);
    });

    it('shows what the account holds in total', () => {
      expect(
        screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.currentTotalBalance)
      ).toHaveTextContent(
        String(agorotToWholeShekels(totalBalance(mockAccountSummary.wallets)))
      );
    });

    it('points its caret at the list it would open', () => {
      expect(
        screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.caret)
      ).toHaveTextContent(ACCOUNT_PICKER_COPY.closedCaret);
    });

    it('reports itself collapsed', () => {
      expect(
        screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger)
      ).toHaveAttribute('aria-expanded', 'false');
    });

    it('asks to toggle the list when tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger));

      expect(mockOnToggle).toHaveBeenCalled();
    });
  });

  describe('while the account list is open', () => {
    beforeEach(() => {
      renderTrigger(true);
    });

    it('turns its caret back on the list', () => {
      expect(
        screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.caret)
      ).toHaveTextContent(ACCOUNT_PICKER_COPY.openCaret);
    });

    it('reports itself expanded', () => {
      expect(
        screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger)
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
