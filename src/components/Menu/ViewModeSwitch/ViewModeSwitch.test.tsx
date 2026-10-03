import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import {
  mockAccountsContext,
  mockAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import {
  closeAndReopenMenu,
  renderInOpenMenu,
  WithMenu,
} from '@/test-utils/menu';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { mockRouter } from '@mocks/next/navigation';
import { ViewModeSwitch } from './ViewModeSwitch';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';

function tapSwitch(): void {
  fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
}

describe('ViewModeSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockAccountSummary });
  });

  describe('the parent switch', () => {
    beforeEach(() => {
      render(
        <WithMenu>
          <ViewModeSwitch viewMode={APP_VIEW_MODE.child} />
        </WithMenu>,
        { accounts: mockAccountsContext }
      );
    });

    it('names the child it simplifies the screen for', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveTextContent(
        VIEW_MODE_SWITCH_COPY.childNote(mockAccountSummary.name)
      );
    });

    it('is off while the account is on the parent screen', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('a parent turns child view on', () => {
    const mockCloseMenu = jest.fn();

    beforeEach(async () => {
      render(
        <WithMenu closeMenu={mockCloseMenu}>
          <ViewModeSwitch viewMode={APP_VIEW_MODE.child} />
        </WithMenu>,
        { accounts: mockAccountsContext }
      );
      tapSwitch();
      await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    });

    it('saves child view on the current account', () => {
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];

      expect([url, JSON.parse(options.body)]).toEqual([
        `/api/accounts/${mockAccountSummary.id}/view-mode`,
        { viewMode: APP_VIEW_MODE.child },
      ]);
    });

    it('closes the menu so the child screen is what shows', () => {
      expect(mockCloseMenu).toHaveBeenCalled();
    });

    it('refreshes so the page loads in child view', () => {
      expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('the save fails', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderInOpenMenu(<ViewModeSwitch viewMode={APP_VIEW_MODE.child} />, {
        accounts: mockAccountsContext,
      });
      tapSwitch();
    });

    it('says the screen did not change', async () => {
      expect(
        await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });

    describe('and the menu is closed and reopened', () => {
      beforeEach(async () => {
        await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);
        closeAndReopenMenu();
      });

      it('forgets the error', () => {
        expect(
          screen.queryByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
        ).not.toBeInTheDocument();
      });
    });
  });
});
