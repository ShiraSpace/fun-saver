import puppeteer, {
  type BoundingBox,
  type Browser,
  type ElementHandle,
  type Page,
} from 'puppeteer';
import { getDocument, queries } from 'pptr-testing-library';

const { findByTestId, queryByTestId } = queries;

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

  async open(baseUrl: string): Promise<void> {
    this.activePage = await this.requireBrowser().newPage();
    await this.activePage.goto(baseUrl, { waitUntil: 'networkidle0' });
  }

  async closePage(): Promise<void> {
    await this.activePage?.close();
    this.activePage = undefined;
  }

  async stop(): Promise<void> {
    await this.browser?.close();
    this.browser = undefined;
  }

  async exists(testId: string): Promise<boolean> {
    const element = await queryByTestId(await getDocument(this.page), testId);
    return element !== null;
  }

  async click(testId: string): Promise<void> {
    const element = await this.find(testId);
    await element.click();
  }

  async hover(testId: string): Promise<void> {
    const element = await this.find(testId);
    await element.hover();
  }

  async box(testId: string): Promise<BoundingBox> {
    const element = await this.find(testId);
    const box = await element.boundingBox();
    if (!box) {
      throw new Error(`element "${testId}" has no bounding box`);
    }
    return box;
  }

  async hasVerticalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.scrollingElement!.scrollHeight > window.innerHeight
    );
  }

  async computedStyle(testId: string, property: string): Promise<string> {
    return this.styleOf(`[data-testid="${testId}"]`, property);
  }

  async styleOf(selector: string, property: string): Promise<string> {
    return this.page.$eval(
      selector,
      (el, prop) => getComputedStyle(el).getPropertyValue(prop),
      property
    );
  }

  async waitForStyle(
    selector: string,
    property: string,
    value: string
  ): Promise<void> {
    await this.page.waitForFunction(
      (sel, prop, expected) =>
        getComputedStyle(
          document.querySelector(sel) as Element
        ).getPropertyValue(prop) === expected,
      {},
      selector,
      property,
      value
    );
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

  private async find(testId: string): Promise<ElementHandle<Element>> {
    return findByTestId(await getDocument(this.page), testId);
  }
}
