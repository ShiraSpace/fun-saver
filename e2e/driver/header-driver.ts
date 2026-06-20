import { type BoundingBox } from 'puppeteer';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { Session } from './session';

export class HeaderDriver {
  constructor(private readonly session: Session) {}

  exists(): Promise<boolean> {
    return this.session.exists(HEADER_TEST_IDS.bar);
  }

  box(): Promise<BoundingBox> {
    return this.session.box(HEADER_TEST_IDS.bar);
  }

  nameBox(): Promise<BoundingBox> {
    return this.session.box(HEADER_TEST_IDS.name);
  }

  avatarBox(): Promise<BoundingBox> {
    return this.session.box(HEADER_TEST_IDS.avatar);
  }

  nameFontSize(): Promise<string> {
    return this.session.computedStyle(HEADER_TEST_IDS.name, 'font-size');
  }
}
