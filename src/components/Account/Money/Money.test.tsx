import { render, screen } from '@testing-library/react';
import { Money } from './Money';

describe('Money', () => {
  it('renders the shekel amount with a currency mark', () => {
    render(<Money amountAgorot={8500} testId="amount" />);
    const amount = screen.getByTestId('amount');

    expect(amount).toHaveTextContent('₪');
    expect(amount).toHaveTextContent('85');
  });

  it('shows whole shekels only, no fraction digits', () => {
    render(<Money amountAgorot={26484} testId="amount" />);

    expect(screen.getByTestId('amount')).toHaveTextContent('₪265');
    expect(screen.getByTestId('amount').textContent).not.toContain('.');
  });
});
