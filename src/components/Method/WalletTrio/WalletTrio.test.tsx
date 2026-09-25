import { render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { DEPOSIT_SHARES } from '@/lib/transaction/constants';
import { METHOD_COPY } from '../copy';
import { WalletTrio } from './WalletTrio';
import { percentLabel } from '../constants';
import { WALLET_TRIO_TEST_IDS } from './constants';

describe('the three wallets drawn side by side', () => {
  const { walletNames } = METHOD_COPY.wallets;

  beforeEach(() => {
    render(<WalletTrio walletNames={walletNames} />);
  });

  it('draws each wallet, because the point of the page is that there are three', () => {
    expect(screen.getAllByTestId(WALLET_TRIO_TEST_IDS.wallet)).toHaveLength(
      walletNames.length
    );
  });

  it('writes on the wallets in the colour measured against them, not the page text colour', () => {
    const walletColours = screen
      .getAllByTestId(WALLET_TRIO_TEST_IDS.wallet)
      .map((trioWallet) => getComputedStyle(trioWallet).color);

    expect(walletColours).toEqual(
      walletNames.map(() => hexToRgb(getThemeTokens().colors.textOnWallet))
    );
  });

  it('takes the shares from the split the app deposits, not from the deck', () => {
    const shown = screen
      .getAllByTestId(WALLET_TRIO_TEST_IDS.share)
      .map((shareLabel) => shareLabel.textContent);

    expect(shown).toEqual(
      walletNames.map((walletName) => percentLabel(DEPOSIT_SHARES[walletName]))
    );
  });
});
