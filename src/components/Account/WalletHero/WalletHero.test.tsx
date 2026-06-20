import { render, screen } from '@testing-library/react';
import { WalletHero } from './WalletHero';
import { WALLET_HERO_TEST_IDS } from './constants';

describe('WalletHero', () => {
  beforeEach(() => {
    render(<WalletHero wallet={{ balance: 8500 }} />);
  });

  it('shows the savings total balance', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.balance)).toHaveTextContent(
      '8500'
    );
  });
});
