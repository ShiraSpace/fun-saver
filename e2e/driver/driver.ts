import puppeteer, { type Browser, type ElementHandle, type Page } from 'puppeteer';
import { getDocument, queries } from 'pptr-testing-library';

const { getByTestId, getAllByTestId, findByTestId, findAllByTestId } = queries;

const TEST_ID = {
  menuButton: 'menu-button',
  menuIcon: 'menu-icon',
  createAccountAction: 'menu-create-account',
  accountNameInput: 'account-name-input',
  avatarOption: 'avatar-option',
  createAccountSubmit: 'create-account-submit',
  headerName: 'header-name',
  headerAvatar: 'header-avatar',
  walletHero: 'wallet-hero',
  walletBalance: 'wallet-balance',
} as const;

const MIDDLE_BAR = `[data-testid="${TEST_ID.menuIcon}"] > span:nth-of-type(2)`;

export interface NewAccount {
  name: string;
  avatarIndex?: number;
}

export class Driver {
  private constructor(
    private readonly browser: Browser,
    private readonly page: Page
  ) {}

  static async launch(baseUrl: string): Promise<Driver> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    return new Driver(browser, page);
  }

  async leave(): Promise<void> {
    await this.browser.close();
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

  async enterAccountName(name: string): Promise<void> {
    const input = await this.find(TEST_ID.accountNameInput);
    await input.type(name);
  }

  async chooseAvatar(avatarIndex: number): Promise<void> {
    const avatars = await this.findAll(TEST_ID.avatarOption);
    await avatars[avatarIndex].click();
  }

  async confirmNewAccount(): Promise<void> {
    const submit = await getByTestId(await this.document(), TEST_ID.createAccountSubmit);
    await submit.click();
  }

  async readHeaderName(): Promise<string> {
    const headerName = await this.find(TEST_ID.headerName);
    return (await headerName.evaluate((el) => el.textContent?.trim())) ?? '';
  }

  async waitForHeaderAvatar(): Promise<void> {
    await this.find(TEST_ID.headerAvatar);
  }

  async waitForSavingsHero(): Promise<void> {
    await this.find(TEST_ID.walletHero);
  }

  async readWalletBalances(): Promise<string[]> {
    const balances = await this.findAll(TEST_ID.walletBalance);
    return Promise.all(balances.map((balance) => balance.evaluate((el) => el.textContent ?? '')));
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
        getComputedStyle(document.querySelector(selector) as Element).opacity === '0',
      {},
      MIDDLE_BAR
    );
  }

  private async clickAction(testId: string): Promise<void> {
    const element = await this.find(testId);
    await element.click();
  }

  private async computedStyle(testId: string, property: string): Promise<string> {
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
