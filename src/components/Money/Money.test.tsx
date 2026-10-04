import { render, screen } from '@testing-library/react';
import { Money } from './Money';
import { MONEY_COPY, MONEY_ROUNDING } from './constants';

describe('Money', () => {
  describe('a whole-shekel amount', () => {
    beforeEach(() => {
      render(<Money amountAgorot={8500} testId="amount" />);
    });

    it('shows the currency mark', () => {
      expect(screen.getByTestId('amount')).toHaveTextContent(
        MONEY_COPY.currencySign
      );
    });

    it('shows the amount in shekels', () => {
      expect(screen.getByTestId('amount')).toHaveTextContent('85');
    });
  });

  describe('an amount carrying agorot', () => {
    beforeEach(() => {
      render(<Money amountAgorot={26484} testId="amount" />);
    });

    it('rounds to the nearest whole shekel', () => {
      expect(screen.getByTestId('amount')).toHaveTextContent('₪265');
    });

    it('shows no fraction digits', () => {
      expect(screen.getByTestId('amount').textContent).not.toContain('.');
    });
  });

  it('gives the currency mark the size of its digits when asked', () => {
    render(<Money amountAgorot={8500} testId="amount" fullSizeCurrency />);

    expect(screen.getByText(MONEY_COPY.currencySign)).toHaveAttribute(
      'data-full-size',
      'true'
    );
  });

  it('shows half shekels when rounding to the nearest half shekel', () => {
    render(
      <Money
        amountAgorot={140}
        testId="amount"
        rounding={MONEY_ROUNDING.nearestHalfShekel}
      />
    );

    expect(screen.getByTestId('amount')).toHaveTextContent('₪1.5');
  });

  it('shows nothing extra when a half-shekel amount rounds to zero', () => {
    render(
      <Money
        amountAgorot={20}
        testId="amount"
        rounding={MONEY_ROUNDING.nearestHalfShekel}
      />
    );

    expect(screen.getByTestId('amount')).toHaveTextContent(/^₪0$/);
  });

  describe('an amount carrying agorot, shown to a child', () => {
    beforeEach(() => {
      render(
        <Money
          amountAgorot={26484}
          testId="amount"
          rounding={MONEY_ROUNDING.downToShekel}
        />
      );
    });

    it('drops the agorot instead of rounding up', () => {
      expect(screen.getByTestId('amount')).toHaveTextContent('₪264');
    });
  });
});
