import { render, screen } from '@/test-utils/render';
import { agorotToWholeShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from './constants';
import { BalanceChange } from './BalanceChange';

const mockTestId = 'balance-change';

function renderBalanceChange(balanceChange: number): void {
  render(<BalanceChange balanceChange={balanceChange} testId={mockTestId} />);
}

describe('a balance change', () => {
  it('puts the sign before the shekel sign, so a fall reads -₪12', () => {
    const mockFall = -1200;
    renderBalanceChange(mockFall);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}${agorotToWholeShekels(-mockFall)}`
    );
  });

  it('signs a rise too', () => {
    const mockRise = 1200;
    renderBalanceChange(mockRise);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${agorotToWholeShekels(mockRise)}`
    );
  });

  it('reads an unchanged balance as no fall', () => {
    renderBalanceChange(0);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${agorotToWholeShekels(0)}`
    );
  });
});
