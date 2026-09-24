import { type BoundingBox } from 'puppeteer';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { NAVIGATION_TABS_TEST_IDS } from '@/components/Menu/NavigationTabs/constants';
import { MENU_USER_SETTINGS_TEST_IDS } from '@/components/Menu/MenuUserSettings/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '@/components/Menu/EditAccountButton/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from '@/components/Menu/AccountPicker/constants';
import { MENU_ACCOUNT_SETTINGS_TEST_IDS } from '@/components/Menu/MenuAccountSettings/constants';
import { SIGNED_IN_USER_SECTION_TEST_IDS } from '@/components/Menu/SignedInUserSection/constants';
import { SIGN_IN_TEST_IDS } from '@/components/SignIn/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '@/components/Menu/AppearanceSection/constants';
import { METHOD_COPY } from '@/components/Method/copy';
import { HEADER_TITLE_TEST_IDS } from '@/components/Header/HeaderTitle/constants';
import { AppBrowser } from './app-browser';

const MIDDLE_BAR = `[data-testid="${MENU_TEST_IDS.menuIcon}"] > span:nth-of-type(2)`;
const OVERLAY = `[data-testid="${MENU_OVERLAY_TEST_IDS.overlay}"]`;
const LISTED_ACCOUNT = `[data-testid="${ACCOUNT_LIST_TEST_IDS.row}"]`;

interface Point {
  x: number;
  y: number;
}

export class MenuDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  async open(): Promise<void> {
    await this.startOpening();
    await this.appBrowser.waitForStyle(MIDDLE_BAR, 'opacity', '0');
    await this.appBrowser.waitForStyle(OVERLAY, 'opacity', '1');
  }

  startOpening(): Promise<void> {
    return this.appBrowser.click(MENU_TEST_IDS.menuButton);
  }

  async openAccountPicker(): Promise<void> {
    await this.appBrowser.click(ACCOUNT_PICKER_TEST_IDS.trigger);
    await this.appBrowser.waitForTestId(ACCOUNT_LIST_TEST_IDS.list);
  }

  listedAccountCount(): Promise<number> {
    return this.appBrowser.count(ACCOUNT_LIST_TEST_IDS.row);
  }

  switchAccount(index: number): Promise<void> {
    return this.appBrowser.clickNth(LISTED_ACCOUNT, index);
  }

  tapAddAccount(): Promise<void> {
    return this.appBrowser.click(ACCOUNT_LIST_TEST_IDS.addAccount);
  }

  tapEditAccount(): Promise<void> {
    return this.appBrowser.click(EDIT_ACCOUNT_BUTTON_TEST_IDS.button);
  }

  tapHomeTab(): Promise<void> {
    return this.appBrowser.click(NAVIGATION_TABS_TEST_IDS.homeTab);
  }

  tapMethodTab(): Promise<void> {
    return this.appBrowser.click(NAVIGATION_TABS_TEST_IDS.methodTab);
  }

  async openMethodPage(): Promise<string> {
    await this.appBrowser.click(NAVIGATION_TABS_TEST_IDS.methodTab);
    await this.appBrowser.waitForText(
      HEADER_TITLE_TEST_IDS.title,
      METHOD_COPY.title
    );

    return this.appBrowser.currentPath();
  }

  async signOut(): Promise<string> {
    const left = this.appBrowser.waitForNavigation();

    await this.appBrowser.click(SIGNED_IN_USER_SECTION_TEST_IDS.signOut);
    await left;
    await this.appBrowser.waitForTestId(SIGN_IN_TEST_IDS.continueWithGoogle);

    return this.appBrowser.currentPath();
  }

  waitForClosed(): Promise<void> {
    return this.appBrowser.waitForStyle(OVERLAY, 'opacity', '0');
  }

  buttonBox(): Promise<BoundingBox> {
    return this.appBrowser.box(MENU_TEST_IDS.menuButton);
  }

  globalScopeBox(): Promise<BoundingBox> {
    return this.appBrowser.box(MENU_USER_SETTINGS_TEST_IDS.block);
  }

  accountScopeBox(): Promise<BoundingBox> {
    return this.appBrowser.box(MENU_ACCOUNT_SETTINGS_TEST_IDS.block);
  }

  appearanceSectionBox(): Promise<BoundingBox> {
    return this.appBrowser.box(APPEARANCE_SECTION_TEST_IDS.section);
  }

  accountListBox(): Promise<BoundingBox> {
    return this.appBrowser.box(ACCOUNT_LIST_TEST_IDS.list);
  }

  accountListReceivesTapAt(point: Point): Promise<boolean> {
    return this.appBrowser.receivesTapAt({
      testId: ACCOUNT_LIST_TEST_IDS.list,
      ...point,
    });
  }

  methodTabBackground(): Promise<string> {
    return this.appBrowser.computedStyle(
      NAVIGATION_TABS_TEST_IDS.methodTab,
      'background-color'
    );
  }

  editAccountButtonBox(): Promise<BoundingBox> {
    return this.appBrowser.box(EDIT_ACCOUNT_BUTTON_TEST_IDS.button);
  }

  iconTransform(): Promise<string> {
    return this.appBrowser.computedStyle(MENU_TEST_IDS.menuIcon, 'transform');
  }

  middleBarOpacity(): Promise<string> {
    return this.appBrowser.styleOf(MIDDLE_BAR, 'opacity');
  }

  overlayBox(): Promise<BoundingBox> {
    return this.appBrowser.box(MENU_OVERLAY_TEST_IDS.overlay);
  }

  overlayBackground(): Promise<string> {
    return this.appBrowser.computedStyle(
      MENU_OVERLAY_TEST_IDS.overlay,
      'background-color'
    );
  }
}
