import { render, screen } from '@/test-support/render';
import { HeroBreakdown } from './HeroBreakdown';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from '../constants';

describe('HeroBreakdown', () => {
  beforeEach(() => {
    render(<HeroBreakdown principal={8000} interestGain={500} />);
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
});
