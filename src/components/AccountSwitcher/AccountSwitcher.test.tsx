import { fireEvent, render, screen } from '@/test-support/render';
import { AccountSwitcher } from './AccountSwitcher';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
import { REVEAL_TEST_IDS } from '@/components/Reveal/constants';
import {
  mockAccount,
  mockDerivedWallets,
  mockSecondAccount,
} from '@/test-support/fixtures';

describe('AccountSwitcher', () => {
  describe('with a single account', () => {
    beforeEach(() => {
      render(
        <AccountSwitcher
          views={[{ account: mockAccount, wallets: mockDerivedWallets }]}
        />
      );
    });

    it('renders the first view account by default', () => {
      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        mockAccount.name
      );
    });

    it('wraps the active account in a reveal transition', () => {
      expect(screen.getByTestId(REVEAL_TEST_IDS.reveal)).toContainElement(
        screen.getByTestId(TITLE_TEST_IDS.title)
      );
    });
  });

  describe('with multiple accounts', () => {
    beforeEach(() => {
      render(
        <AccountSwitcher
          views={[
            { account: mockAccount, wallets: mockDerivedWallets },
            { account: mockSecondAccount, wallets: mockDerivedWallets },
          ]}
        />
      );

      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
    });

    it('switches to the account whose chip is tapped', () => {
      const chips = screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip);
      fireEvent.click(chips[1]);

      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        mockSecondAccount.name
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
