import { render, screen } from '@/test-utils/render';
import { createMockDerivedWallet } from '@/test-utils/fixtures';
import { SavingsStatStrip } from './SavingsStatStrip';
import { STAT_STRIP_TEST_IDS } from '../../WalletCard/StatStrip/constants';

describe('SavingsStatStrip', () => {
  it('shows the strip for the savings wallet', () => {
    render(<SavingsStatStrip wallet={createMockDerivedWallet()} />);

    expect(screen.getByTestId(STAT_STRIP_TEST_IDS.strip)).toBeInTheDocument();
  });

  it('shows nothing for the spending wallet', () => {
    render(
      <SavingsStatStrip
        wallet={createMockDerivedWallet({ name: 'spending' })}
      />
    );

    expect(
      screen.queryByTestId(STAT_STRIP_TEST_IDS.strip)
    ).not.toBeInTheDocument();
  });

  it('shows nothing for the good-deeds wallet', () => {
    render(
      <SavingsStatStrip
        wallet={createMockDerivedWallet({ name: 'goodDeeds' })}
      />
    );

    expect(
      screen.queryByTestId(STAT_STRIP_TEST_IDS.strip)
    ).not.toBeInTheDocument();
  });
});
