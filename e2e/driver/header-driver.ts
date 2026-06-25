import { type BoundingBox } from 'puppeteer';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { Session } from './session';

export class HeaderDriver {
  constructor(private readonly session: Session) {}

  exists(): Promise<boolean> {
    return this.session.exists(HEADER_TEST_IDS.bar);
  }

  box(): Promise<BoundingBox> {
    return this.session.box(HEADER_TEST_IDS.bar);
  }

  name(): Promise<string> {
    return this.session.text(TITLE_TEST_IDS.title);
  }

  nameBox(): Promise<BoundingBox> {
    return this.session.box(TITLE_TEST_IDS.title);
  }

  avatarBox(): Promise<BoundingBox> {
    return this.session.box(HEADER_TEST_IDS.avatar);
  }

  nameFontSize(): Promise<string> {
    return this.session.computedStyle(TITLE_TEST_IDS.title, 'font-size');
  }

  background(): Promise<string> {
    return this.session.computedStyle(HEADER_TEST_IDS.bar, 'background-color');
  }

  shadow(): Promise<string> {
    return this.session.computedStyle(HEADER_TEST_IDS.bar, 'box-shadow');
  }

  titleColor(): Promise<string> {
    return this.session.computedStyle(TITLE_TEST_IDS.title, 'color');
  }

  async waitForTransparentBar(): Promise<void> {
    await this.session.waitForStyle(
      `[data-testid="${HEADER_TEST_IDS.bar}"]`,
      'background-color',
      'rgba(0, 0, 0, 0)'
    );
  }
}
