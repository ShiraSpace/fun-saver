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
  switchTo: ViewMode;
  viewMode: ViewMode;
  closeMenu?: () => void;
}

function renderSwitch({ switchTo, viewMode, closeMenu }: SwitchScene): void {
  render(
    <WithMenu closeMenu={closeMenu}>
      <ViewModeSwitch viewMode={switchTo} />
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
        switchTo: VIEW_MODE.child,
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

  describe('the parent switch', () => {
    beforeEach(() => {
      renderSwitch({ switchTo: VIEW_MODE.child, viewMode: VIEW_MODE.parent });
    });

    it('says it is for every child on this phone', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.childNote);
    });

    it('is off in parent mode', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('a parent turns child mode on', () => {
    const mockCloseMenu = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      renderSwitch({
        switchTo: VIEW_MODE.child,
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

  describe.each([
    [VIEW_MODE.parent, VIEW_MODE.child],
    [VIEW_MODE.child, VIEW_MODE.parent],
  ])('switching from %s mode to %s mode', (viewMode, switchTo) => {
    beforeEach(async () => {
      renderSwitch({ switchTo, viewMode });
      tapSwitch();
      await passTime(VIEW_MODE_SWITCH_MOTION.slideMs);
      await passTime(MENU_OVERLAY_STYLE.transitionMs);
    });

    it(`turns ${switchTo} mode on once the menu has faded`, () => {
      expect(readCookie(VIEW_MODE_COOKIE)).toBe(switchTo);
    });
  });

  describe("the child's way back", () => {
    beforeEach(() => {
      renderSwitch({ switchTo: VIEW_MODE.parent, viewMode: VIEW_MODE.child });
    });

    it('is labelled for the parent', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.label[VIEW_MODE.parent]);
    });

    it('carries no note about the children', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      ).not.toHaveTextContent(VIEW_MODE_SWITCH_COPY.childNote);
    });
  });
});
