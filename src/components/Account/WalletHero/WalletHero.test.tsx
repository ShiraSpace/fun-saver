import { render, screen } from '@testing-library/react';
import { WalletHero } from './WalletHero';
import { WALLET_HERO_TEST_IDS } from './constants';
import { COIN_ROW_TEST_IDS } from '../CoinRow/constants';

describe('WalletHero', () => {
  beforeEach(() => {
    render(
      <WalletHero
        name="נועה"
        wallet={{
          balance: 8500,
          principal: 8000,
          interestGain: 500,
          todayInterest: 150,
          monthlyInterestRate: 0.15,
          openedAt: '2026-01-01',
        }}
      />
    );
  });

  it('renders the hero card', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.hero)).toBeInTheDocument();
  });

  it('shows the decorative corner star', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.cornerStar)
    ).toBeInTheDocument();
  });

  it('composes the head, amount, coin row and breakdown', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.eyebrow)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.balance)
    ).toBeInTheDocument();
    expect(screen.getByTestId(COIN_ROW_TEST_IDS.row)).toBeInTheDocument();
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.deposits)
    ).toBeInTheDocument();
  });
});
