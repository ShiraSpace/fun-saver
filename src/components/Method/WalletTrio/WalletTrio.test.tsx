import { render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { DEPOSIT_SPLIT } from '@/lib/constants';
import { METHOD_COPY } from '../copy';
import { WalletTrio } from './WalletTrio';
import { share } from '../constants';
import { WALLET_TRIO_TEST_IDS } from './constants';

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

  it('writes on the pots in the colour measured against them, not the page text colour', () => {
    const potColours = screen
      .getAllByTestId(WALLET_TRIO_TEST_IDS.pot)
      .map((pot) => getComputedStyle(pot).color);

    expect(potColours).toEqual(
      pots.map(() => hexToRgb(getThemeTokens().colors.textOnPot))
    );
  });

  it('takes the shares from the split the app deposits, not from the deck', () => {
    const shown = screen
      .getAllByTestId(WALLET_TRIO_TEST_IDS.share)
      .map((share) => share.textContent);

    expect(shown).toEqual(pots.map((wallet) => share(DEPOSIT_SPLIT[wallet])));
  });
});
