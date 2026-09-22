import { render, screen } from '@/test-utils/render';
import { DEPOSIT_SPLIT } from '@/lib/constants';
import { METHOD_COPY } from '../copy';
import { WalletTrio } from './WalletTrio';
import { WALLET_TRIO_COPY, WALLET_TRIO_TEST_IDS } from './constants';

describe('the three wallets drawn as pots', () => {
  const { pots } = METHOD_COPY.wallets;

  beforeEach(() => {
    render(<WalletTrio pots={pots} />);
  });

  it('draws a pot per wallet, because the point of the page is that there are three', () => {
    expect(screen.getAllByTestId(WALLET_TRIO_TEST_IDS.pot)).toHaveLength(
      pots.length
    );
  });

  it('takes the shares from the split the app deposits, not from the deck', () => {
    const shown = screen
      .getAllByTestId(WALLET_TRIO_TEST_IDS.share)
      .map((share) => share.textContent);

    expect(shown).toEqual(
      pots.map((pot) => WALLET_TRIO_COPY.share(DEPOSIT_SPLIT[pot.wallet]))
    );
  });
});
