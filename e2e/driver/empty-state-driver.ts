import { EMPTY_STATE_TEST_IDS } from '@/components/EmptyState/constants';
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

  waitForCtaTransform(value: string): Promise<void> {
    return this.session.waitForStyle(
      `[data-testid="${EMPTY_STATE_TEST_IDS.createAccount}"]`,
      'transform',
      value
    );
  }
}
