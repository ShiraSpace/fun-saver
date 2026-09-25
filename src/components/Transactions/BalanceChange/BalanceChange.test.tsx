import { render, screen } from '@/test-utils/render';
import { balanceChangeInShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { shekelsText } from '../money-text';
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
      `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}${-balanceChangeInShekels(mockFall)}`
    );
  });

  it('signs a rise too', () => {
    const mockRise = 1200;
    renderBalanceChange(mockRise);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${balanceChangeInShekels(mockRise)}`
    );
  });

  it('shows a fall of half a shekel, rather than rounding it away', () => {
    const mockHalfShekelFall = -40;
    renderBalanceChange(mockHalfShekelFall);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}${-balanceChangeInShekels(mockHalfShekelFall)}`
    );
  });

  it('reads an unchanged balance as no fall', () => {
    renderBalanceChange(0);

    expect(screen.getByTestId(mockTestId)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${balanceChangeInShekels(0)}`
    );
  });

  describe('shown in agorot', () => {
    const mockDayOfInterest = 9;

    it('shows agorot when asked, so a day of interest never reads +₪0', () => {
      render(
        <BalanceChange
          balanceChange={mockDayOfInterest}
          withAgorot
          testId={mockTestId}
        />
      );

      expect(screen.getByTestId(mockTestId)).toHaveTextContent(
        `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${shekelsText(mockDayOfInterest, true)}`
      );
    });

    it('signs a small fall, rather than reading it as a rise', () => {
      render(
        <BalanceChange
          balanceChange={-mockDayOfInterest}
          withAgorot
          testId={mockTestId}
        />
      );

      expect(screen.getByTestId(mockTestId)).toHaveTextContent(
        `${BALANCE_CHANGE_COPY.fell}${MONEY_COPY.currencySign}${shekelsText(mockDayOfInterest, true)}`
      );
    });
  });
});
