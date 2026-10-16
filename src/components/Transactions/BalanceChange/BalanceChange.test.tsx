import { render, screen } from '@/test-utils/render';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from './constants';
import { BalanceChange } from './BalanceChange';

const mockTestId = 'balance-change';

function renderBalanceChange(balanceChange: number): void {
  render(<BalanceChange balanceChange={balanceChange} testId={mockTestId} />);
}

describe('a balance change', () => {
  it('puts the sign before the shekel sign, so a fall reads -₪12', () => {
    renderBalanceChange(-1200);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}12`
    );
  });

  it('signs a rise too', () => {
    renderBalanceChange(1200);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}12`
    );
  });

  it('shows the change to the tenth of a shekel', () => {
    renderBalanceChange(-85);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}0.8`
    );
  });

  it('reads an unchanged balance as no fall', () => {
    renderBalanceChange(0);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}0`
    );
  });

  it('signs a fall below a tenth, rather than reading it as a rise', () => {
    renderBalanceChange(-9);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}0.09`
    );
  });
});
