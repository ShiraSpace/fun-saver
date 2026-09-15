import { fireEvent, render, screen } from '@/test-utils/render';
import { mockDerivedAccount } from '@/test-utils/fixtures';
import { totalBalance } from '@/lib/derivations';
import { agorotToWholeShekels } from '@/lib/money';
import { AccountRow } from './AccountRow';
import { ACCOUNT_LIST_TEST_IDS } from './constants';

const mockOnSelect = jest.fn();

function renderRow(isSelected: boolean): void {
  jest.clearAllMocks();
  render(
    <AccountRow
      account={mockDerivedAccount}
      isSelected={isSelected}
      onSelect={mockOnSelect}
    />
  );
}

describe('AccountRow', () => {
  describe('when another account is selected', () => {
    beforeEach(() => {
      renderRow(false);
    });

    it('names the account', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveTextContent(
        mockDerivedAccount.name
      );
    });

    it('shows what the account holds in total', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.total)).toHaveTextContent(
        String(agorotToWholeShekels(totalBalance(mockDerivedAccount.wallets)))
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

      expect(mockOnSelect).toHaveBeenCalledWith(mockDerivedAccount.id);
    });
  });

  describe('when it is the selected account', () => {
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
