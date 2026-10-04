import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { mockRouter } from '@mocks/next/navigation';
import {
  mockAccountsContext,
  mockAccountSummary,
  mockChildAccountSummary,
  mockSiblingAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import {
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_TEST_IDS,
} from '../ViewModeSwitch/constants';
import type { AccountSummary } from '@/lib/account/types';
import { totalBalance } from '@/lib/wallet/balance';
import { agorotToWholeShekels } from '@/lib/money';
import { AccountRow } from './AccountRow';
import { ACCOUNT_LIST_TEST_IDS } from './constants';

const mockOnSelect = jest.fn();

function renderRow(
  account: AccountSummary,
  isCurrent: boolean,
  closeMenu?: () => void
): void {
  render(
    <WithMenu closeMenu={closeMenu}>
      <AccountRow
        account={account}
        isCurrent={isCurrent}
        onSelect={mockOnSelect}
      />
    </WithMenu>,
    { accounts: mockAccountsContext }
  );
}

function childViewToggle(): HTMLElement {
  return screen.getByTestId(ACCOUNT_LIST_TEST_IDS.childViewToggle);
}

describe('AccountRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
  });

  describe('when another account is selected', () => {
    beforeEach(() => {
      renderRow(mockAccountSummary, false);
    });

    it('names the account', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveTextContent(
        mockAccountSummary.name
      );
    });

    it('shows what the account holds in total', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.total)).toHaveTextContent(
        String(agorotToWholeShekels(totalBalance(mockAccountSummary.wallets)))
      );
    });

    it('is not marked current', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveAttribute(
        'aria-current',
        'false'
      );
    });

    it('reports its account when tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row));

      expect(mockOnSelect).toHaveBeenCalledWith(mockAccountSummary.id);
    });

    it('leaves its view mode alone when its name is tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row));

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('when it is the current account', () => {
    beforeEach(() => {
      renderRow(mockAccountSummary, true);
    });

    it('marks itself current', () => {
      expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveAttribute(
        'aria-current',
        'true'
      );
    });
  });

  describe('its child-view switch', () => {
    describe('on an account saved in child view', () => {
      beforeEach(() => {
        renderRow(mockChildAccountSummary, false);
      });

      it('is on', () => {
        expect(childViewToggle()).toHaveAttribute('aria-checked', 'true');
      });
    });

    describe('on an account saved in parent view', () => {
      beforeEach(() => {
        renderRow(mockAccountSummary, false);
      });

      it('is off', () => {
        expect(childViewToggle()).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('tapped on another account', () => {
      beforeEach(() => {
        renderRow(mockSiblingAccountSummary, false);
        fireEvent.click(childViewToggle());
      });

      it('saves the view mode of its own account, not the current one', () => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(
            `/api/accounts/${mockSiblingAccountSummary.id}/`
          ),
          expect.anything()
        );
      });
    });
  });

  describe("another account's switch is saved", () => {
    const mockCloseMenu = jest.fn();

    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSiblingAccountSummary,
      });
      renderRow(mockSiblingAccountSummary, false, mockCloseMenu);
      fireEvent.click(childViewToggle());
      await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    });

    it('keeps the menu open', () => {
      expect(mockCloseMenu).not.toHaveBeenCalled();
    });

    it('shows the switch on', () => {
      expect(childViewToggle()).toHaveAttribute('aria-checked', 'true');
    });

    it('unlocks the switch for the next tap', () => {
      expect(childViewToggle()).toBeEnabled();
    });
  });

  describe('the save fails', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderRow(mockSiblingAccountSummary, false);
      fireEvent.click(childViewToggle());
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);
    });

    it('says the view did not change, under its row', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });

    it('slides the switch back off', () => {
      expect(childViewToggle()).toHaveAttribute('aria-checked', 'false');
    });

    it('unlocks the switch so the parent can try again', () => {
      expect(childViewToggle()).toBeEnabled();
    });
  });
});
