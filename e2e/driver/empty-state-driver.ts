import { EMPTY_STATE_TEST_IDS } from '@/components/EmptyState/constants';
import { Session } from './session';

export class EmptyStateDriver {
  constructor(private readonly session: Session) {}

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
