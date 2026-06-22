import { fireEvent, render, screen } from '@/test-support/render';
import { AccountSwitcher } from './AccountSwitcher';
import type { Account } from '@/lib/types';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
import { ACCOUNT, DERIVED_WALLETS } from '@/test-support/fixtures';

const SECOND_ACCOUNT: Account = {
  id: 'a2',
  name: 'מתן',
  avatarId: 'kid-08',
  isActive: true,
};

describe('AccountSwitcher', () => {
  it('renders the first view account by default', () => {
    render(
      <AccountSwitcher
        views={[{ account: ACCOUNT, wallets: DERIVED_WALLETS }]}
      />
    );

    expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
      ACCOUNT.name
    );
  });

  it('switches to the account whose chip is tapped', () => {
    render(
      <AccountSwitcher
        views={[
          { account: ACCOUNT, wallets: DERIVED_WALLETS },
          { account: SECOND_ACCOUNT, wallets: DERIVED_WALLETS },
        ]}
      />
    );

    fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
    const chips = screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip);
    fireEvent.click(chips[1]);

    expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
      SECOND_ACCOUNT.name
    );
  });
});
