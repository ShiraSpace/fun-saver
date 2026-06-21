import { render, screen } from '@testing-library/react';
import { HeroHead } from './HeroHead';
import { WALLET_HERO_TEST_IDS } from '../constants';

describe('HeroHead', () => {
  beforeEach(() => {
    render(
      <HeroHead name="נועה" monthlyInterestRate={0.15} openedAt="2026-01-01" />
    );
  });

  it('shows the savings eyebrow with the account name', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.eyebrow)).toHaveTextContent(
      'החיסכון של נועה'
    );
  });

  it('shows the piggy icon', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.icon)).toHaveTextContent(
      '🐷'
    );
  });

  it('shows the monthly interest rate', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.interestRate)
    ).toHaveTextContent('צובר ריבית — 15%/חודש');
  });

  it('shows when the wallet was opened', () => {
    expect(
      screen.getByTestId(WALLET_HERO_TEST_IDS.activeSince)
    ).toHaveTextContent('פעיל מאז 1 בינואר');
  });
});
