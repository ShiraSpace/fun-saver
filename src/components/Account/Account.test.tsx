import { render, screen } from '@testing-library/react';
import { Account } from './Account';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { WALLET_HERO_TEST_IDS } from './WalletHero/constants';
import { WALLET_LIST_TEST_IDS } from './WalletList/constants';
import { WALLET_CARD_TEST_IDS } from './WalletCard/constants';
import { DERIVED_WALLETS } from '@/test-support/fixtures';

describe('Account', () => {
  const ACCOUNT_NAME = 'יעל';
  const AVATAR_ID = 'kid-01';

  beforeEach(() => {
    render(
      <Account
        name={ACCOUNT_NAME}
        avatarId={AVATAR_ID}
        wallets={DERIVED_WALLETS}
      />
    );
  });

  it('shows the account header with the account name', () => {
    expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
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
});
