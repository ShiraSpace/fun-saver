import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import {
  mockAccountsContext,
  mockAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { closeAndReopenMenu, renderInOpenMenu } from '@/test-utils/menu';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { Header } from '@/components/Header';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { MENU_TEST_IDS } from '../constants';
import { ViewModeSwitch } from './ViewModeSwitch';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';

function tapSwitch(): void {
  fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
}

function tapSwitchInHeaderMenu(): void {
  render(
    <Header title={mockAccountSummary.name} account={mockAccountSummary} />,
    { route: HOME_ROUTE, accounts: mockAccountsContext, user: mockUser }
  );
  fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
  tapSwitch();
}

describe('ViewModeSwitch while it saves', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('while the save has not answered', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
    });

    describe('and the parent taps again', () => {
      beforeEach(() => {
        renderInOpenMenu(<ViewModeSwitch viewMode={VIEW_MODE.child} />, {
          accounts: mockAccountsContext,
        });
        tapSwitch();
        tapSwitch();
      });

      it('sends no second save', () => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    describe('in the header menu', () => {
      beforeEach(() => {
        tapSwitchInHeaderMenu();
      });

      it('runs the header loader', () => {
        expect(
          screen.getByTestId(HEADER_TEST_IDS.progress)
        ).toBeInTheDocument();
      });
    });
  });

  describe('the save fails in the header menu', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      tapSwitchInHeaderMenu();
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);
    });

    it('takes the header loader away', async () => {
      await waitFor(() =>
        expect(
          screen.queryByTestId(HEADER_TEST_IDS.progress)
        ).not.toBeInTheDocument()
      );
    });
  });

  describe('the save fails', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderInOpenMenu(<ViewModeSwitch viewMode={VIEW_MODE.child} />, {
        accounts: mockAccountsContext,
      });
      tapSwitch();
    });

    it('says the screen did not change', async () => {
      expect(
        await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });

    it('slides the switch back off', async () => {
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);

      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveAttribute('aria-checked', 'false');
    });

    it('unlocks the switch so the parent can try again', async () => {
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);

      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toBeEnabled();
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
