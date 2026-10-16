import { render, screen } from '@/test-utils/render';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { SavingsInterestStats } from './SavingsInterestStats';
import { INTEREST_STATS_TEST_IDS } from '../../WalletCard/InterestStats/constants';

describe('SavingsInterestStats', () => {
  it('shows the interest stats for the savings wallet', () => {
    render(<SavingsInterestStats wallet={createMockWalletSummary()} />);

    expect(screen.getByTestId(INTEREST_STATS_TEST_IDS.stats)).toBeInTheDocument();
  });

  it('shows nothing for the spending wallet', () => {
    render(<SavingsInterestStats wallet={createMockWalletSummary({ name: 'spending' })} />);

    expect(screen.queryByTestId(INTEREST_STATS_TEST_IDS.stats)).not.toBeInTheDocument();
  });

  it('shows nothing for the good-deeds wallet', () => {
    render(<SavingsInterestStats wallet={createMockWalletSummary({ name: 'goodDeeds' })} />);

    expect(screen.queryByTestId(INTEREST_STATS_TEST_IDS.stats)).not.toBeInTheDocument();
  });

  describe('when savings has agorot', () => {
    beforeEach(() => {
      render(
        <SavingsInterestStats
          wallet={createMockWalletSummary({ balance: 4710, principal: 4040, interestEarned: 670 })}
        />
      );
    });

    it('floors the interest earned', () => {
      expect(screen.getByTestId(INTEREST_STATS_TEST_IDS.interestEarned)).toHaveTextContent('₪6');
    });

    it('shows as principal what the floored balance holds beyond the interest', () => {
      expect(screen.getByTestId(INTEREST_STATS_TEST_IDS.principal)).toHaveTextContent('₪41');
    });
  });
});
