import { type BoundingBox } from 'puppeteer';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { HEADER_TITLE_TEST_IDS } from '@/components/Header/HeaderTitle/constants';
import { AppBrowser } from './app-browser';

export class HeaderDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  exists(): Promise<boolean> {
    return this.appBrowser.exists(HEADER_TEST_IDS.bar);
  }

  box(): Promise<BoundingBox> {
    return this.appBrowser.box(HEADER_TEST_IDS.bar);
  }

  homeLinkExists(): Promise<boolean> {
    return this.appBrowser.exists(HEADER_TEST_IDS.homeLink);
  }

  homeLinkBox(): Promise<BoundingBox> {
    return this.appBrowser.box(HEADER_TEST_IDS.homeLink);
  }

  title(): Promise<string> {
    return this.appBrowser.text(HEADER_TITLE_TEST_IDS.title);
  }

  waitForTitle(title: string): Promise<void> {
    return this.appBrowser.waitForText(HEADER_TITLE_TEST_IDS.title, title);
  }

  titleBox(): Promise<BoundingBox> {
    return this.appBrowser.box(HEADER_TITLE_TEST_IDS.title);
  }

  avatarSource(): Promise<string> {
    return this.appBrowser.imageSource(HEADER_TEST_IDS.avatar);
  }

  waitForAvatar(avatarId: string): Promise<void> {
    return this.appBrowser.waitForImageSource(HEADER_TEST_IDS.avatar, avatarId);
  }

  avatarBox(): Promise<BoundingBox> {
    return this.appBrowser.box(HEADER_TEST_IDS.avatar);
  }

  titleFontSize(): Promise<string> {
    return this.appBrowser.computedStyle(
      HEADER_TITLE_TEST_IDS.title,
      'font-size'
    );
  }

  background(): Promise<string> {
    return this.appBrowser.computedStyle(
      HEADER_TEST_IDS.bar,
      'background-color'
    );
  }

  shadow(): Promise<string> {
    return this.appBrowser.computedStyle(HEADER_TEST_IDS.bar, 'box-shadow');
  }

  tapHomeLink(): Promise<void> {
    return this.appBrowser.click(HEADER_TEST_IDS.homeLink);
  }

  hasProgressLine(): Promise<boolean> {
    return this.appBrowser.exists(HEADER_TEST_IDS.progress);
  }

  titleColor(): Promise<string> {
    return this.appBrowser.computedStyle(HEADER_TITLE_TEST_IDS.title, 'color');
  }
}
