import { PRIMARY_BUTTON } from '@/components/PrimaryButton/constants';
import {
  EMPTY_STATE_ANIMATION,
  EMPTY_STATE_TEST_IDS,
} from '@/components/EmptyState/constants';
import { AppBrowser } from './app-browser';

export class EmptyStateDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  exists(): Promise<boolean> {
    return this.appBrowser.exists(EMPTY_STATE_TEST_IDS.container);
  }

  ctaBackground(): Promise<string> {
    return this.appBrowser.computedStyle(
      EMPTY_STATE_TEST_IDS.createAccount,
      'background-image'
    );
  }

  background(): Promise<string> {
    return this.appBrowser.computedStyle(
      EMPTY_STATE_TEST_IDS.container,
      'background-image'
    );
  }

  tapCreateAccount(): Promise<void> {
    return this.appBrowser.click(EMPTY_STATE_TEST_IDS.createAccount);
  }

  hoverCreateAccount(): Promise<void> {
    return this.appBrowser.hover(EMPTY_STATE_TEST_IDS.createAccount);
  }

  waitForCtaToLift(): Promise<void> {
    return this.appBrowser.waitForStyle(
      `[data-testid="${EMPTY_STATE_TEST_IDS.createAccount}"]`,
      'transform',
      `matrix(1, 0, 0, 1, 0, -${PRIMARY_BUTTON.hoverLift})`
    );
  }

  waitForPigToOink(): Promise<void> {
    return this.appBrowser.waitForStyle(
      `[data-testid="${EMPTY_STATE_TEST_IDS.pig}"]`,
      'animation-duration',
      `${EMPTY_STATE_ANIMATION.oinkMs / 1000}s`
    );
  }
}
