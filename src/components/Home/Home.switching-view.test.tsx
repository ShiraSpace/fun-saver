import { fireEvent, screen, waitFor } from '@/test-utils/render';
import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import {
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_MOTION,
  VIEW_MODE_SWITCH_TEST_IDS,
} from '@/components/Menu/ViewModeSwitch/constants';
import {
  MENU_OVERLAY_STYLE,
  MENU_OVERLAY_TEST_IDS,
} from '@/components/Menu/MenuOverlay/constants';
import { openMenu, renderHome } from './home-test-helpers';

function tapViewModeSwitch(): void {
  fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
}

describe('Home switching between the parent and child screens', () => {
  describe('a parent turns child view on and the save has not answered yet', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
      renderHome();
      openMenu();
      tapViewModeSwitch();
      await screen.findByTestId(CHILD_ACCOUNT_TEST_IDS.screen);
    });

    it('shows the child screen without waiting for the save', () => {
      expect(
        screen.getByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).toBeInTheDocument();
    });
  });

  describe('a parent turns child view on and the menu starts closing', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
      renderHome();
      openMenu();
      tapViewModeSwitch();
      await waitFor(() =>
        expect(
          screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)
        ).toHaveAttribute('data-open', 'false')
      );
    });

    it('keeps the parent screen while the menu fades away', () => {
      expect(
        screen.queryByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).not.toBeInTheDocument();
    });
  });

  describe('a parent turns child view on and the save fails', () => {
    const mockSaveAnswersAfterMs =
      (VIEW_MODE_SWITCH_MOTION.slideMs + MENU_OVERLAY_STYLE.transitionMs) * 2;

    beforeEach(async () => {
      global.fetch = jest
        .fn()
        .mockReturnValue(
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: false }), mockSaveAnswersAfterMs)
          )
        );
      renderHome();
      openMenu();
      tapViewModeSwitch();
      await screen.findByTestId(CHILD_ACCOUNT_TEST_IDS.screen);
      await waitFor(() =>
        expect(
          screen.queryByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
        ).not.toBeInTheDocument()
      );
    });

    it('goes back to the parent screen', () => {
      expect(
        screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction)
      ).toBeInTheDocument();
    });

    describe('and the parent opens the menu', () => {
      beforeEach(() => {
        openMenu();
      });

      it('tells the parent the screen did not change', () => {
        expect(
          screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
        ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
      });
    });
  });
});
