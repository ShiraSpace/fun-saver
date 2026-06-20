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

  clickCreateAccount(): Promise<void> {
    return this.session.click(EMPTY_STATE_TEST_IDS.createAccount);
  }
}
