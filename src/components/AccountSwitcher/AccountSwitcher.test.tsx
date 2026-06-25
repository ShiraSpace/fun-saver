import { fireEvent, render, screen } from '@/test-support/render';
import { AccountSwitcher } from './AccountSwitcher';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
import { REVEAL_TEST_IDS } from '@/components/Reveal/constants';
import {
  ACCOUNT,
  DERIVED_WALLETS,
  SECOND_ACCOUNT,
} from '@/test-support/fixtures';

describe('AccountSwitcher', () => {
  describe('with a single account', () => {
    beforeEach(() => {
      render(
        <AccountSwitcher
          views={[{ account: ACCOUNT, wallets: DERIVED_WALLETS }]}
        />
      );
    });

    it('renders the first view account by default', () => {
      expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
        ACCOUNT.name
      );
    });

    it('wraps the active account in a reveal transition', () => {
      expect(screen.getByTestId(REVEAL_TEST_IDS.reveal)).toContainElement(
        screen.getByTestId(HEADER_TEST_IDS.name)
      );
    });
  });

  describe('with multiple accounts', () => {
    beforeEach(() => {
      render(
        <AccountSwitcher
          views={[
            { account: ACCOUNT, wallets: DERIVED_WALLETS },
            { account: SECOND_ACCOUNT, wallets: DERIVED_WALLETS },
          ]}
        />
      );

      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
    });

    it('switches to the account whose chip is tapped', () => {
      const chips = screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip);
      fireEvent.click(chips[1]);

      expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
        SECOND_ACCOUNT.name
      );
    });

    it('closes the menu after an account is selected', () => {
      expect(screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)).toHaveAttribute(
        'data-open',
        'true'
      );

      fireEvent.click(screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip)[1]);

      expect(screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)).toHaveAttribute(
        'data-open',
        'false'
      );
    });
  });
});
