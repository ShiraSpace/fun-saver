import { act, fireEvent, render, screen } from '@/test-utils/render';
import { mockAccountsContext } from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';
import { readCookie, VIEW_MODE_COOKIE } from '@/lib/cookies';
import { prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
import { MENU_OVERLAY_STYLE } from '../MenuOverlay/constants';
import { ViewModeSwitch } from './ViewModeSwitch';
import {
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_MOTION,
  VIEW_MODE_SWITCH_TEST_IDS,
} from './constants';

interface SwitchScene {
  viewMode: ViewMode;
  closeMenu?: () => void;
}

function renderSwitch({ viewMode, closeMenu }: SwitchScene): void {
  render(
    <WithMenu closeMenu={closeMenu}>
      <ViewModeSwitch />
    </WithMenu>,
    { accounts: mockAccountsContext, viewMode }
  );
}

function tapSwitch(): void {
  fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
}

function passTime(milliseconds: number): Promise<void> {
  return act(() => jest.advanceTimersByTimeAsync(milliseconds));
}

describe('ViewModeSwitch', () => {
  describe.each([
    [VIEW_MODE.parent, 'false'],
    [VIEW_MODE.child, 'true'],
  ])('in %s mode', (viewMode, isOn) => {
    beforeEach(() => {
      renderSwitch({ viewMode });
    });

    it(`shows the ${viewMode} face on the knob`, () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.knobFace[viewMode]);
    });

    it('is named by its label alone, without the face', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveAccessibleName(VIEW_MODE_SWITCH_COPY.label);
    });

    it(`has aria-checked ${isOn}`, () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveAttribute('aria-checked', isOn);
    });
  });

  describe('as time passes', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('for someone who turned animations off', () => {
      const mockCloseMenu = jest.fn();

      beforeEach(async () => {
        prefersReducedMotion();
        renderSwitch({
          viewMode: VIEW_MODE.parent,
          closeMenu: mockCloseMenu,
        });
        tapSwitch();
        await passTime(1);
      });

      afterEach(() => {
        prefersMotion();
      });

      it('closes the menu without waiting for a slide that does not play', () => {
        expect(mockCloseMenu).toHaveBeenCalled();
      });
    });

    describe('a parent turns child mode on', () => {
      const mockCloseMenu = jest.fn();

      beforeEach(() => {
        jest.clearAllMocks();
        renderSwitch({
          viewMode: VIEW_MODE.parent,
          closeMenu: mockCloseMenu,
        });
        tapSwitch();
      });

      it('slides on the moment it is tapped', () => {
        expect(
          screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
        ).toHaveAttribute('aria-checked', 'true');
      });

      it('cannot be tapped again while it slides', () => {
        expect(
          screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
        ).toBeDisabled();
      });

      describe('once the knob has slid', () => {
        beforeEach(async () => {
          await passTime(VIEW_MODE_SWITCH_MOTION.slideMs);
        });

        it('closes the menu', () => {
          expect(mockCloseMenu).toHaveBeenCalledTimes(1);
        });

        it('keeps parent mode while the menu fades', () => {
          expect(readCookie(VIEW_MODE_COOKIE)).toBe(VIEW_MODE.parent);
        });
      });
    });

    describe('a parent taps twice in a row', () => {
      beforeEach(async () => {
        renderSwitch({ viewMode: VIEW_MODE.parent });
        tapSwitch();
        tapSwitch();
        await passTime(VIEW_MODE_SWITCH_MOTION.slideMs);
        await passTime(MENU_OVERLAY_STYLE.transitionMs);
      });

      it('turns child mode on once', () => {
        expect(readCookie(VIEW_MODE_COOKIE)).toBe(VIEW_MODE.child);
      });
    });

    describe.each([
      [VIEW_MODE.parent, VIEW_MODE.child],
      [VIEW_MODE.child, VIEW_MODE.parent],
    ])('switching from %s mode to %s mode', (viewMode, switchTo) => {
      beforeEach(async () => {
        renderSwitch({ viewMode });
        tapSwitch();
        await passTime(VIEW_MODE_SWITCH_MOTION.slideMs);
        await passTime(MENU_OVERLAY_STYLE.transitionMs);
      });

      it(`turns ${switchTo} mode on once the menu has faded`, () => {
        expect(readCookie(VIEW_MODE_COOKIE)).toBe(switchTo);
      });

      it(`can be tapped again once ${switchTo} mode is on`, () => {
        expect(
          screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
        ).toBeEnabled();
      });
    });
  });
});
