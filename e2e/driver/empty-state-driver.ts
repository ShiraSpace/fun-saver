import { ACTION_BUTTON } from '@/components/ActionButton/constants';
import {
  EMPTY_STATE_ANIMATION,
  EMPTY_STATE_TEST_IDS,
} from '@/components/EmptyState/constants';
import { Session } from './session';

export class EmptyStateDriver {
  constructor(private readonly session: Session) {}

  exists(): Promise<boolean> {
    return this.session.exists(EMPTY_STATE_TEST_IDS.container);
  }

  ctaColor(): Promise<string> {
    return this.session.computedStyle(
      EMPTY_STATE_TEST_IDS.createAccount,
      'background-color'
    );
  }

  background(): Promise<string> {
    return this.session.computedStyle(
      EMPTY_STATE_TEST_IDS.container,
      'background-image'
    );
  }

  clickCreateAccount(): Promise<void> {
    return this.session.click(EMPTY_STATE_TEST_IDS.createAccount);
  }

  hoverCreateAccount(): Promise<void> {
    return this.session.hover(EMPTY_STATE_TEST_IDS.createAccount);
  }

  waitForCtaToLift(): Promise<void> {
    return this.session.waitForStyle(
      `[data-testid="${EMPTY_STATE_TEST_IDS.createAccount}"]`,
      'transform',
      `matrix(1, 0, 0, 1, 0, -${ACTION_BUTTON.hoverLift})`
    );
  }

  waitForPigToOink(): Promise<void> {
    return this.session.waitForStyle(
      `[data-testid="${EMPTY_STATE_TEST_IDS.pig}"]`,
      'animation-duration',
      `${EMPTY_STATE_ANIMATION.oinkMs / 1000}s`
    );
  }
}
