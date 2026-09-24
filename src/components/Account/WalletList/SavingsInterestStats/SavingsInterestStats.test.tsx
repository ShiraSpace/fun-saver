import { render, screen } from '@/test-utils/render';
import { createMockDerivedWallet } from '@/test-utils/fixtures';
import { SavingsInterestStats } from './SavingsInterestStats';
import { INTEREST_STATS_TEST_IDS } from '../../WalletCard/InterestStats/constants';

describe('SavingsInterestStats', () => {
  it('shows the interest stats for the savings wallet', () => {
    render(<SavingsInterestStats wallet={createMockDerivedWallet()} />);

    expect(
      screen.getByTestId(INTEREST_STATS_TEST_IDS.stats)
    ).toBeInTheDocument();
  });

  it('shows nothing for the spending wallet', () => {
    render(
      <SavingsInterestStats
        wallet={createMockDerivedWallet({ name: 'spending' })}
      />
    );

    expect(
      screen.queryByTestId(INTEREST_STATS_TEST_IDS.stats)
    ).not.toBeInTheDocument();
  });

  it('shows nothing for the good-deeds wallet', () => {
    render(
      <SavingsInterestStats
        wallet={createMockDerivedWallet({ name: 'goodDeeds' })}
      />
    );

    expect(
      screen.queryByTestId(INTEREST_STATS_TEST_IDS.stats)
    ).not.toBeInTheDocument();
  });
});
