import { fireEvent, render, screen } from '@/test-support/render';
import { Account } from './Account';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { WALLET_HERO_TEST_IDS } from './WalletHero/constants';
import { WALLET_LIST_TEST_IDS } from './WalletList/constants';
import { WALLET_CARD_TEST_IDS } from './WalletCard/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from './TransactionDrawer/constants';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';
import { mockDerivedWallets } from '@/test-support/fixtures';

describe('Account', () => {
  const ACCOUNT_ID = 'account-1';
  const ACCOUNT_NAME = 'יעל';
  const AVATAR_ID = 'kid-01';

  beforeEach(() => {
    render(
      <Account
        accountId={ACCOUNT_ID}
        name={ACCOUNT_NAME}
        avatarId={AVATAR_ID}
        wallets={mockDerivedWallets}
      />
    );
  });

  it('shows the account header with the account name', () => {
    expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
      ACCOUNT_NAME
    );
  });

  it('shows the savings hero', () => {
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.hero)).toBeInTheDocument();
    expect(screen.getByTestId(WALLET_HERO_TEST_IDS.eyebrow)).toHaveTextContent(
      'החיסכון של יעל'
    );
  });

  it('shows the additional pots as wallet cards', () => {
    expect(screen.getByTestId(WALLET_LIST_TEST_IDS.label)).toBeInTheDocument();
    expect(screen.getAllByTestId(WALLET_CARD_TEST_IDS.card)).toHaveLength(2);
  });

  it('shows the new-action CTA button', () => {
    const cta = screen.getByTestId(ACCOUNT_TEST_IDS.actionCta);

    expect(cta.tagName).toBe('BUTTON');
    expect(cta).toHaveTextContent(ACCOUNT_COPY.actionCta);
  });

  it('opens the transaction drawer when the CTA is clicked', () => {
    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId(ACCOUNT_TEST_IDS.actionCta));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
    ).toBeInTheDocument();
  });

  it('closes the drawer when the scrim is clicked', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_TEST_IDS.actionCta));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.scrim));

    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
    ).not.toBeInTheDocument();
  });
});
