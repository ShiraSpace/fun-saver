import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { AppBrowser } from './app-browser';

export class ChildAccountDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  isShown(): Promise<boolean> {
    return this.appBrowser.exists(CHILD_ACCOUNT_TEST_IDS.screen);
  }

  async waitUntilShown(): Promise<void> {
    await this.appBrowser.waitForTestId(CHILD_ACCOUNT_TEST_IDS.screen);
  }
}
