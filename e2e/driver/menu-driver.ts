import { type BoundingBox } from 'puppeteer';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
import { Session } from './session';

const MIDDLE_BAR = `[data-testid="${MENU_TEST_IDS.menuIcon}"] > span:nth-of-type(2)`;
const OVERLAY = `[data-testid="${MENU_OVERLAY_TEST_IDS.overlay}"]`;
const ACCOUNT_CHIP = `[data-testid="${ACCOUNTS_SECTION_TEST_IDS.chip}"]`;

export class MenuDriver {
  constructor(private readonly session: Session) {}

  async open(): Promise<void> {
    await this.session.click(MENU_TEST_IDS.menuButton);
    await this.session.waitForStyle(MIDDLE_BAR, 'opacity', '0');
    await this.session.waitForStyle(OVERLAY, 'opacity', '1');
  }

  accountChipCount(): Promise<number> {
    return this.session.count(ACCOUNTS_SECTION_TEST_IDS.chip);
  }

  selectAccount(index: number): Promise<void> {
    return this.session.clickNth(ACCOUNT_CHIP, index);
  }

  clickAddAccountChip(): Promise<void> {
    return this.session.click(ACCOUNTS_SECTION_TEST_IDS.addChip);
  }

  waitForClosed(): Promise<void> {
    return this.session.waitForStyle(OVERLAY, 'opacity', '0');
  }

  buttonBox(): Promise<BoundingBox> {
    return this.session.box(MENU_TEST_IDS.menuButton);
  }

  iconTransform(): Promise<string> {
    return this.session.computedStyle(MENU_TEST_IDS.menuIcon, 'transform');
  }

  middleBarOpacity(): Promise<string> {
    return this.session.styleOf(MIDDLE_BAR, 'opacity');
  }
}
