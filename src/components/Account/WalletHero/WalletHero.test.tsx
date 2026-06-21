import { render, screen } from '@testing-library/react';
import { WalletHero } from './WalletHero';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from './constants';
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

  it('shows the savings total balance in shekels', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.balance)).toHaveTextContent(
      '₪85'
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

  it('shows the deposits cell with its label and amount', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.deposits)).toHaveTextContent(
      '80'
    );
    expect(
      screen.getByText(WALLET_HERO_COPY.depositsLabel)
    ).toBeInTheDocument();
  });

  it('shows the interest-gain cell with its label and amount', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.interestGain)
    ).toHaveTextContent('5');
    expect(
      screen.getByText(WALLET_HERO_COPY.interestGainLabel)
    ).toBeInTheDocument();
  });

  it('shows the daily-interest coin row', () => {
    expect(screen.getByTestId(COIN_ROW_TEST_IDS.row)).toBeInTheDocument();
  });
});
