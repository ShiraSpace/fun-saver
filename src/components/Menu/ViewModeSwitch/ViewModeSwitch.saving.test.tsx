import { act, fireEvent, render, screen, waitFor } from '@/test-utils/render';
import {
  mockAccountsContext,
  mockAccountSummary,
  mockChildAccountsContext,
  mockChildAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { closeAndReopenMenu, renderInOpenMenu } from '@/test-utils/menu';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
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
    <Header
      title={mockChildAccountSummary.name}
      account={mockChildAccountSummary}
    />,
    { route: HOME_ROUTE, accounts: mockChildAccountsContext, user: mockUser }
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

  describe('the save succeeds in the header menu', () => {
    beforeEach(async () => {
      prefersReducedMotion();
      jest.useFakeTimers();
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccountSummary });
      tapSwitchInHeaderMenu();
      await act(() => jest.advanceTimersByTimeAsync(1));
    });

    afterEach(() => {
      jest.useRealTimers();
      prefersMotion();
    });

    it('keeps the switch locked after the menu closes', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toBeDisabled();
    });

    it('keeps the header loader running after the menu closes', () => {
      expect(screen.getByTestId(HEADER_TEST_IDS.progress)).toBeInTheDocument();
    });
  });

  describe('the save fails', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderInOpenMenu(<ViewModeSwitch viewMode={VIEW_MODE.child} />, {
        accounts: mockAccountsContext,
      });
      tapSwitch();
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);
    });

    it('says the screen did not change', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });

    it('slides the switch back off', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveAttribute('aria-checked', 'false');
    });

    it('unlocks the switch so the parent can try again', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toBeEnabled();
    });

    describe('and the menu is closed and reopened', () => {
      beforeEach(() => {
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
