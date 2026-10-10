import puppeteer, {
  type BoundingBox,
  type Browser,
  type CookieData,
  type Page,
} from 'puppeteer';
import * as actions from './page-actions';
import * as queries from './page-queries';
import * as waits from './page-waits';
import { holdNextPage, type HeldPage } from './hold-next-page';

interface OpenOptions {
  baseUrl: string;
  motion: queries.MotionPreference;
  cookies: CookieData[];
}

interface ViewportOptions {
  width: number;
  height: number;
  deviceScaleFactor?: number;
}

interface TapOptions {
  testId: string;
  x: number;
  y: number;
}

export class AppBrowser {
  private browser?: Browser;
  private activePage?: Page;
  private baseUrl = '';

  private constructor() {}

  static create(): AppBrowser {
    return new AppBrowser();
  }

  async start(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: true });
  }

  async open({ baseUrl, motion, cookies }: OpenOptions): Promise<void> {
    const browser = this.requireBrowser();
    this.baseUrl = baseUrl;
    this.activePage = await browser.newPage();
    await this.clearCookies(browser);
    await browser.setCookie(...cookies);
    await this.activePage.emulateMediaFeatures(queries.motionFeatures(motion));
    await this.activePage.goto(baseUrl, { waitUntil: 'networkidle0' });
  }

  async visit(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, {
      waitUntil: 'networkidle0',
    });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle0' });
  }

  async back(): Promise<void> {
    await this.page.evaluate((): void => window.history.back());
  }

  async resize(viewport: ViewportOptions): Promise<void> {
    await this.page.setViewport({ deviceScaleFactor: 1, ...viewport });
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

  visitWithoutScripts(path: string): Promise<void> {
    return actions.visitWithoutScripts(this.page, `${this.baseUrl}${path}`);
  }

  setDocumentTheme(themeId: string): Promise<void> {
    return actions.setDocumentTheme(this.page, themeId);
  }

  storeTheme(themeId: string): Promise<void> {
    return actions.storeTheme({ page: this.page, url: this.baseUrl, themeId });
  }

  firstPaintThemeId(): Promise<unknown> {
    return queries.firstPaintThemeId(this.page);
  }

  holdNextPage(): Promise<HeldPage> {
    return holdNextPage(this.page);
  }

  rawResponse(path: string, cookie: string): Promise<queries.RawResponse> {
    return queries.rawResponse(`${this.baseUrl}${path}`, cookie);
  }

  servedHtml(path: string): Promise<string> {
    return queries.servedHtml(this.page, path);
  }

  currentPath(): string {
    return queries.currentPath(this.page);
  }

  signedInUserId(): Promise<string> {
    return queries.signedInUserId(this.page);
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  }

  canTakeFocus(testId: string): Promise<boolean> {
    return queries.canTakeFocus(this.page, testId);
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

  receivesTapAt({ testId, x, y }: TapOptions): Promise<boolean> {
    return queries.receivesTapAt({ page: this.page, testId, x, y });
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

  tapAt(x: number, y: number): Promise<void> {
    return this.page.mouse.click(x, y);
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

  waitForAnyTestId(testIds: readonly string[]): Promise<void> {
    return waits.waitForAnyTestId(this.page, testIds);
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

  private async clearCookies(browser: Browser): Promise<void> {
    await browser.deleteCookie(...(await browser.cookies()));
  }

  private requireBrowser(): Browser {
    if (!this.browser) {
      throw new Error('the app browser is not started; call start() first');
    }
    return this.browser;
  }
}
