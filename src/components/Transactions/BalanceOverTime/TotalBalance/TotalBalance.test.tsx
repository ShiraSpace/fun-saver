import { render, screen } from '@/test-utils/render';
import { MONEY_COPY } from '@/components/Money/constants';
import { TOTAL_BALANCE_TEST_IDS } from './constants';
import { TotalBalance } from './TotalBalance';

const mockChangeLabel = 'השבוע';

function renderTotalBalance(balanceChange: number): void {
  render(
    <TotalBalance
      totalBalance={16000}
      balanceChange={balanceChange}
      changeLabel={mockChangeLabel}
    />
  );
}

function changeOverRange(): HTMLElement {
  return screen.getByTestId(TOTAL_BALANCE_TEST_IDS.changeOverRange);
}

describe('the total balance', () => {
  describe('when the balance fell over the range', () => {
    beforeEach(() => {
      renderTotalBalance(-1200);
    });

    it('marks the change as a fall', () => {
      expect(changeOverRange()).toHaveAttribute('data-balance-fell', 'true');
    });

    it('names the range it is measuring', () => {
      expect(changeOverRange()).toHaveTextContent(mockChangeLabel);
    });
  });

  describe('when the balance fell by too little to show', () => {
    beforeEach(() => {
      renderTotalBalance(-20);
    });

    it('does not mark it as a fall', () => {
      expect(changeOverRange()).toHaveAttribute('data-balance-fell', 'false');
    });
  });

  describe('when the balance did not move over the range', () => {
    beforeEach(() => {
      renderTotalBalance(0);
    });

    it('does not mark it as a fall', () => {
      expect(changeOverRange()).toHaveAttribute('data-balance-fell', 'false');
    });
  });

  it('rounds the balance down to whole shekels', () => {
    render(<TotalBalance totalBalance={22060} balanceChange={0} changeLabel={mockChangeLabel} />);

    expect(screen.getByTestId(TOTAL_BALANCE_TEST_IDS.totalBalance)).toHaveTextContent(
      `${MONEY_COPY.currencySign}220`
    );
  });
});
