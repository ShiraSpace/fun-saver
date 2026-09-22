import { render, screen } from '@testing-library/react';
import { Money } from './Money';
import { MONEY_COPY } from './constants';

describe('Money', () => {
  describe('a whole-shekel amount', () => {
    beforeEach(() => {
      render(<Money amountAgorot={8500} testId="amount" />);
    });

    it('shows the currency mark', () => {
      expect(screen.getByTestId('amount')).toHaveTextContent(
        MONEY_COPY.currency
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

    expect(screen.getByText(MONEY_COPY.currency)).toHaveAttribute(
      'data-full-size',
      'true'
    );
  });

  it('shows half shekels when allowHalf is set', () => {
    render(<Money amountAgorot={140} testId="amount" allowHalf />);

    expect(screen.getByTestId('amount')).toHaveTextContent('₪1.5');
  });

  it('shows nothing extra when a half-shekel amount rounds to zero', () => {
    render(<Money amountAgorot={20} testId="amount" allowHalf />);

    expect(screen.getByTestId('amount')).toHaveTextContent('₪0');
  });
});
