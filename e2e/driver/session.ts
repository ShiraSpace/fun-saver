import puppeteer, {
  type BoundingBox,
  type Browser,
  type CookieData,
  type Page,
} from 'puppeteer';
import * as actions from './page-actions';
import * as queries from './page-queries';
import * as waits from './page-waits';

interface OpenOptions {
  baseUrl: string;
  motion: queries.MotionPreference;
  cookie: CookieData;
}

interface ViewportOptions {
  width: number;
  height: number;
  deviceScaleFactor?: number;
}

export class Session {
  private browser?: Browser;
  private activePage?: Page;

  private constructor() {}

  static create(): Session {
    return new Session();
  }

  async start(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: true });
  }

  async open({ baseUrl, motion, cookie }: OpenOptions): Promise<void> {
    const browser = this.requireBrowser();
    this.activePage = await browser.newPage();
    await browser.setCookie(cookie);
    await this.activePage.emulateMediaFeatures(queries.motionFeatures(motion));
    await this.activePage.goto(baseUrl, { waitUntil: 'networkidle0' });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle0' });
  }

  async resize({
    width,
    height,
    deviceScaleFactor = 1,
  }: ViewportOptions): Promise<void> {
    await this.page.setViewport({ width, height, deviceScaleFactor });
  }

  async screenshot(path: `${string}.png`): Promise<void> {
    await this.page.screenshot({ path });
  }

  async closePage(): Promise<void> {
    await this.activePage?.close();
    this.activePage = undefined;
  }

  async stop(): Promise<void> {
    await this.browser?.close();
    this.browser = undefined;
  }

  currentPath(): string {
    return queries.currentPath(this.page);
  }

  signedInUserId(): Promise<string> {
    return queries.signedInUserId(this.page);
  }

  exists(testId: string): Promise<boolean> {
    return queries.exists(this.page, testId);
  }

  count(testId: string): Promise<number> {
    return queries.count(this.page, testId);
  }

  styleValues(testId: string, property: string): Promise<string[]> {
    return queries.styleValues(this.page, testId, property);
  }

  text(testId: string): Promise<string> {
    return queries.text(this.page, testId);
  }

  texts(testId: string): Promise<string[]> {
    return queries.texts(this.page, testId);
  }

  value(testId: string): Promise<string> {
    return queries.value(this.page, testId);
  }

  imageSource(testId: string): Promise<string> {
    return queries.imageSource(this.page, testId);
  }

  box(testId: string): Promise<BoundingBox> {
    return queries.box(this.page, testId);
  }

  hasVerticalScroll(): Promise<boolean> {
    return queries.hasVerticalScroll(this.page);
  }

  computedStyle(testId: string, property: string): Promise<string> {
    return queries.computedStyle({ page: this.page, testId, property });
  }

  styleOf(selector: string, property: string): Promise<string> {
    return queries.styleOf({ page: this.page, selector, property });
  }

  click(testId: string): Promise<void> {
    return actions.click(this.page, testId);
  }

  hover(testId: string): Promise<void> {
    return actions.hover(this.page, testId);
  }

  type(testId: string, value: string): Promise<void> {
    return actions.type({ page: this.page, testId, value });
  }

  replace(testId: string, value: string): Promise<void> {
    return actions.replace({ page: this.page, testId, value });
  }

  clickSelector(selector: string): Promise<void> {
    return actions.clickSelector(this.page, selector);
  }

  hoverSelector(selector: string): Promise<void> {
    return actions.hoverSelector(this.page, selector);
  }

  clickNth(selector: string, index: number): Promise<void> {
    return actions.clickNth({ page: this.page, selector, index });
  }

  waitForTestId(testId: string): Promise<void> {
    return waits.waitForTestId({ page: this.page, testId });
  }

  waitForStyle(
    selector: string,
    property: string,
    value: string
  ): Promise<void> {
    return waits.waitForStyle({ page: this.page, selector, property, value });
  }

  waitForText(testId: string, expected: string): Promise<void> {
    return waits.waitForText({ page: this.page, testId, expected });
  }

  waitForImageSource(testId: string, expected: string): Promise<void> {
    return waits.waitForImageSource({ page: this.page, testId, expected });
  }

  private get page(): Page {
    if (!this.activePage) {
      throw new Error('no page is open; call open(baseUrl) first');
    }
    return this.activePage;
  }

  private requireBrowser(): Browser {
    if (!this.browser) {
      throw new Error('session not started; call start() first');
    }
    return this.browser;
  }
}
