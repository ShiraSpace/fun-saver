import { type BoundingBox } from 'puppeteer';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { Session } from './session';

const MIDDLE_BAR = `[data-testid="${MENU_TEST_IDS.menuIcon}"] > span:nth-of-type(2)`;

export class MenuDriver {
  constructor(private readonly session: Session) {}

  async open(): Promise<void> {
    await this.session.click(MENU_TEST_IDS.menuButton);
    await this.session.waitForStyle(MIDDLE_BAR, 'opacity', '0');
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
