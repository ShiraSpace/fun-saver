import { fireEvent, render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { totalBalance } from '@/lib/wallet/balance';
import { agorotToWholeShekels } from '@/lib/money';
import { AccountRow } from './AccountRow';
import { ACCOUNT_LIST_TEST_IDS } from './constants';

const mockOnSelect = jest.fn();

function renderRow(isCurrent: boolean): void {
  render(
    <AccountRow
      account={mockAccountSummary}
      isCurrent={isCurrent}
      onSelect={mockOnSelect}
    />
  );
}

describe('AccountRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when another account is selected', () => {
    beforeEach(() => {
      renderRow(false);
    });

    it('names the account', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveTextContent(
        mockAccountSummary.name
      );
    });

    it('shows what the account holds in total', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.total)).toHaveTextContent(
        String(agorotToWholeShekels(totalBalance(mockAccountSummary.wallets)))
      );
    });

    it('is not marked current', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveAttribute(
        'aria-current',
        'false'
      );
    });

    it('reports its account when tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row));

      expect(mockOnSelect).toHaveBeenCalledWith(mockAccountSummary.id);
    });
  });

  describe('when it is the current account', () => {
    beforeEach(() => {
      renderRow(true);
    });

    it('marks itself current', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveAttribute(
        'aria-current',
        'true'
      );
    });
  });
});
