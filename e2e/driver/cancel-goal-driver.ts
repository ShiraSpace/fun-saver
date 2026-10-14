import { MENU_GOAL_TEST_IDS } from '@/components/Menu/MenuGoal/constants';
import { CANCEL_GOAL_TEST_IDS } from '@/components/Goal/CancelGoal/constants';
import {
  HOLD_TO_CANCEL,
  HOLD_TO_CANCEL_TEST_IDS,
} from '@/components/Goal/CancelGoal/HoldToCancel/constants';
import { AppBrowser } from './app-browser';
import type { HeldRequest } from './hold-request';
import type { MenuDriver } from './menu-driver';

const HOLD_MARGIN_MS = 300;

const SHORT_PRESS_MS = 300;

export class CancelGoalDriver {
  constructor(
    private readonly appBrowser: AppBrowser,
    private readonly menu: MenuDriver
  ) {}

  async openFromMenu(): Promise<void> {
    await this.appBrowser.click(MENU_GOAL_TEST_IDS.cancelGoal);
    await this.appBrowser.waits.testId(CANCEL_GOAL_TEST_IDS.container);
    await this.menu.waitForClosed();
  }

  holdToCancel(): Promise<void> {
    return this.appBrowser.pressAndHold(
      HOLD_TO_CANCEL_TEST_IDS.button,
      HOLD_TO_CANCEL.holdMs + HOLD_MARGIN_MS
    );
  }

  tapHoldToCancel(): Promise<void> {
    return this.appBrowser.pressAndHold(HOLD_TO_CANCEL_TEST_IDS.button, SHORT_PRESS_MS);
  }

  waitOutTheHold(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, HOLD_TO_CANCEL.holdMs + HOLD_MARGIN_MS));
  }

  holdTheCancel(): Promise<HeldRequest> {
    return this.appBrowser.holdRequest('DELETE');
  }

  pressEscape(): Promise<void> {
    return this.appBrowser.pressKey('Escape');
  }

  waitForDialogGone(): Promise<void> {
    return this.appBrowser.waits.testIdGone(CANCEL_GOAL_TEST_IDS.container);
  }

  waitForCancelError(): Promise<void> {
    return this.appBrowser.waits.testId(HOLD_TO_CANCEL_TEST_IDS.cancelError);
  }

  dialogExists(): Promise<boolean> {
    return this.appBrowser.exists(CANCEL_GOAL_TEST_IDS.container);
  }

  setGoalOfferedInMenu(): Promise<boolean> {
    return this.appBrowser.exists(MENU_GOAL_TEST_IDS.setGoal);
  }
}
