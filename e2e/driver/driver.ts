import puppeteer, {
  type BoundingBox,
  type Browser,
  type ElementHandle,
  type Page,
} from 'puppeteer';
import { getDocument, queries } from 'pptr-testing-library';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { HEADER_TEST_IDS } from '@/components/Header/constants';

const { findByTestId, findAllByTestId } = queries;

const TEST_ID = {
  menuButton: MENU_TEST_IDS.menuButton,
  menuIcon: MENU_TEST_IDS.menuIcon,
  headerBar: HEADER_TEST_IDS.bar,
  headerName: HEADER_TEST_IDS.name,
  headerAvatar: HEADER_TEST_IDS.avatar,
  createAccountAction: 'menu-create-account',
  accountNameInput: 'account-name-input',
  avatarOption: 'avatar-option',
  createAccountSubmit: 'create-account-submit',
  walletHero: 'wallet-hero',
  walletBalance: 'wallet-balance',
} as const;

const MIDDLE_BAR = `[data-testid="${TEST_ID.menuIcon}"] > span:nth-of-type(2)`;

export interface NewAccount {
  name: string;
  avatarIndex?: number;
}

export class Driver {
  private browser?: Browser;
  private activePage?: Page;

  private constructor() {}

  static create(): Driver {
    return new Driver();
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

  private requireBrowser(): Browser {
    if (!this.browser) {
      throw new Error('driver not started; call start() first');
    }

    return this.browser;
  }

  private get page(): Page {
    if (!this.activePage) {
      throw new Error('no page is open; call open(baseUrl) first');
    }

    return this.activePage;
  }

  async openMenu(): Promise<void> {
    await this.clickAction(TEST_ID.menuButton);
    await this.waitForMenuMorphComplete();
  }

  async createAccount({ name, avatarIndex = 0 }: NewAccount): Promise<void> {
    await this.openMenu();
    await this.clickAction(TEST_ID.createAccountAction);
    await this.enterAccountName(name);
    await this.chooseAvatar(avatarIndex);
    await this.confirmNewAccount();
  }

  private async enterAccountName(name: string): Promise<void> {
    const input = await this.find(TEST_ID.accountNameInput);
    await input.type(name);
  }

  private async chooseAvatar(avatarIndex: number): Promise<void> {
    const avatars = await this.findAll(TEST_ID.avatarOption);
    await avatars[avatarIndex].click();
  }

  private async confirmNewAccount(): Promise<void> {
    await this.clickAction(TEST_ID.createAccountSubmit);
  }

  async readHeaderName(): Promise<string> {
    const headerName = await this.find(TEST_ID.headerName);
    return (await headerName.evaluate((el) => el.textContent?.trim())) ?? '';
  }

  async readWalletBalances(): Promise<string[]> {
    const balances = await this.findAll(TEST_ID.walletBalance);

    return Promise.all(
      balances.map((balance) => balance.evaluate((el) => el.textContent ?? ''))
    );
  }

  async headerBox(): Promise<BoundingBox> {
    return this.box(TEST_ID.headerBar);
  }

  async menuBox(): Promise<BoundingBox> {
    return this.box(TEST_ID.menuButton);
  }

  async headerNameBox(): Promise<BoundingBox> {
    return this.box(TEST_ID.headerName);
  }

  async headerAvatarBox(): Promise<BoundingBox> {
    return this.box(TEST_ID.headerAvatar);
  }

  async headerNameFontSize(): Promise<string> {
    return this.computedStyle(TEST_ID.headerName, 'font-size');
  }

  async menuIconTransform(): Promise<string> {
    return this.computedStyle(TEST_ID.menuIcon, 'transform');
  }

  async menuMiddleBarOpacity(): Promise<string> {
    return this.page.$eval(MIDDLE_BAR, (el) => getComputedStyle(el).opacity);
  }

  private async waitForMenuMorphComplete(): Promise<void> {
    await this.page.waitForFunction(
      (selector: string) =>
        getComputedStyle(document.querySelector(selector) as Element)
          .opacity === '0',
      {},
      MIDDLE_BAR
    );
  }

  private async clickAction(testId: string): Promise<void> {
    const element = await this.find(testId);
    await element.click();
  }

  private async box(testId: string): Promise<BoundingBox> {
    const element = await this.find(testId);
    const box = await element.boundingBox();

    if (!box) {
      throw new Error(`element "${testId}" has no bounding box`);
    }

    return box;
  }

  private async computedStyle(
    testId: string,
    property: string
  ): Promise<string> {
    return this.page.$eval(
      `[data-testid="${testId}"]`,
      (el, prop) => getComputedStyle(el).getPropertyValue(prop),
      property
    );
  }

  private async document(): Promise<ElementHandle<Element>> {
    return getDocument(this.page);
  }

  private async find(testId: string): Promise<ElementHandle<Element>> {
    return findByTestId(await this.document(), testId);
  }

  private async findAll(testId: string): Promise<ElementHandle<Element>[]> {
    return findAllByTestId(await this.document(), testId);
  }
}
