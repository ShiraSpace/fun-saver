import { render, screen } from '@testing-library/react';
import { HeroAmount } from './HeroAmount';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from '../constants';

describe('HeroAmount', () => {
  beforeEach(() => {
    render(<HeroAmount balance={8500} />);
  });

  it('shows the total-in-pot label', () => {
    expect(screen.getByText(WALLET_HERO_COPY.totalLabel)).toBeInTheDocument();
  });

  it('shows the balance in shekels', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.balance)).toHaveTextContent(
      '₪85'
    );
  });
});
