import { render, screen } from '@testing-library/react';
import { Money } from './Money';

describe('Money', () => {
  it('renders the shekel amount with a currency mark', () => {
    render(<Money amountAgorot={8500} testId="amount" />);
    const amount = screen.getByTestId('amount');
    expect(amount).toHaveTextContent('₪');
    expect(amount).toHaveTextContent('85');
  });
});
