import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { Session } from './session';

export class CreateAccountDriver {
  constructor(private readonly session: Session) {}

  async isOpen(): Promise<boolean> {
    await this.session.box(CREATE_ACCOUNT_TEST_IDS.nameInput);
    return true;
  }

  background(): Promise<string> {
    return this.session.computedStyle(
      CREATE_ACCOUNT_TEST_IDS.container,
      'background-image'
    );
  }
}
