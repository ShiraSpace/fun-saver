import { render, screen } from '@testing-library/react';
import { WalletHero } from './WalletHero';
import { WALLET_HERO_TEST_IDS } from './constants';

describe('WalletHero', () => {
  beforeEach(() => {
    render(
      <WalletHero
        name="נועה"
        wallet={{
          balance: 8500,
          monthlyInterestRate: 0.15,
          openedAt: '2026-01-01',
        }}
      />
    );
  });

  it('shows the savings total balance', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.balance)).toHaveTextContent(
      '8500'
    );
  });

  it('shows the savings eyebrow with the account name', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.eyebrow)).toHaveTextContent(
      'החיסכון של נועה'
    );
  });

  it('shows the savings piggy icon', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.icon)).toHaveTextContent(
      '🐷'
    );
  });

  it('shows the monthly interest rate', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.interestRate)
    ).toHaveTextContent('צובר ריבית — 15%/חודש');
  });

  it('shows when the savings wallet was opened', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.activeSince)
    ).toHaveTextContent('פעיל מאז 1 בינואר');
  });
});
