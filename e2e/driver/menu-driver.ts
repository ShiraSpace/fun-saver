import { type BoundingBox } from 'puppeteer';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { NAV_TABS_TEST_IDS } from '@/components/Menu/NavTabs/constants';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from '@/components/Menu/MenuGlobalScope/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '@/components/Menu/EditAccountButton/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from '@/components/Menu/AccountPicker/constants';
import { MENU_ACCOUNT_SCOPE_TEST_IDS } from '@/components/Menu/MenuAccountScope/constants';
import { PROFILE_SECTION_TEST_IDS } from '@/components/Menu/ProfileSection/constants';
import { SIGN_IN_TEST_IDS } from '@/components/SignIn/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '@/components/Menu/AppearanceSection/constants';
import { METHOD_COPY } from '@/components/Method/copy';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { Session } from './session';

const MIDDLE_BAR = `[data-testid="${MENU_TEST_IDS.menuIcon}"] > span:nth-of-type(2)`;
const OVERLAY = `[data-testid="${MENU_OVERLAY_TEST_IDS.overlay}"]`;
const ACCOUNT_ROW = `[data-testid="${ACCOUNT_LIST_TEST_IDS.row}"]`;

interface Point {
  x: number;
  y: number;
}

export class MenuDriver {
  constructor(private readonly session: Session) {}

  async open(): Promise<void> {
    await this.session.click(MENU_TEST_IDS.menuButton);
    await this.session.waitForStyle(MIDDLE_BAR, 'opacity', '0');
    await this.session.waitForStyle(OVERLAY, 'opacity', '1');
  }

  async openAccountPicker(): Promise<void> {
    await this.session.click(ACCOUNT_PICKER_TEST_IDS.trigger);
    await this.session.waitForTestId(ACCOUNT_LIST_TEST_IDS.list);
  }

  accountRowCount(): Promise<number> {
    return this.session.count(ACCOUNT_LIST_TEST_IDS.row);
  }

  selectAccount(index: number): Promise<void> {
    return this.session.clickNth(ACCOUNT_ROW, index);
  }

  clickAddAccountRow(): Promise<void> {
    return this.session.click(ACCOUNT_LIST_TEST_IDS.addRow);
  }

  clickEditAccountButton(): Promise<void> {
    return this.session.click(EDIT_ACCOUNT_BUTTON_TEST_IDS.button);
  }

  async openMethodPage(): Promise<string> {
    await this.session.click(NAV_TABS_TEST_IDS.methodTab);
    await this.session.waitForText(TITLE_TEST_IDS.title, METHOD_COPY.title);

    return this.session.currentPath();
  }

  async signOut(): Promise<string> {
    const left = this.session.waitForNavigation();

    await this.session.click(PROFILE_SECTION_TEST_IDS.signOut);
    await left;
    await this.session.waitForTestId(SIGN_IN_TEST_IDS.continueWithGoogle);

    return this.session.currentPath();
  }

  waitForClosed(): Promise<void> {
    return this.session.waitForStyle(OVERLAY, 'opacity', '0');
  }

  buttonBox(): Promise<BoundingBox> {
    return this.session.box(MENU_TEST_IDS.menuButton);
  }

  globalScopeBox(): Promise<BoundingBox> {
    return this.session.box(MENU_GLOBAL_SCOPE_TEST_IDS.block);
  }

  accountScopeBox(): Promise<BoundingBox> {
    return this.session.box(MENU_ACCOUNT_SCOPE_TEST_IDS.block);
  }

  appearanceSectionBox(): Promise<BoundingBox> {
    return this.session.box(APPEARANCE_SECTION_TEST_IDS.section);
  }

  accountListBox(): Promise<BoundingBox> {
    return this.session.box(ACCOUNT_LIST_TEST_IDS.list);
  }

  accountListReceivesTapAt(point: Point): Promise<boolean> {
    return this.session.receivesTapAt({
      testId: ACCOUNT_LIST_TEST_IDS.list,
      ...point,
    });
  }

  methodTabBackground(): Promise<string> {
    return this.session.computedStyle(
      NAV_TABS_TEST_IDS.methodTab,
      'background-color'
    );
  }

  editAccountButtonBox(): Promise<BoundingBox> {
    return this.session.box(EDIT_ACCOUNT_BUTTON_TEST_IDS.button);
  }

  iconTransform(): Promise<string> {
    return this.session.computedStyle(MENU_TEST_IDS.menuIcon, 'transform');
  }

  middleBarOpacity(): Promise<string> {
    return this.session.styleOf(MIDDLE_BAR, 'opacity');
  }

  panelBox(): Promise<BoundingBox> {
    return this.session.box(MENU_OVERLAY_TEST_IDS.overlay);
  }

  panelBackground(): Promise<string> {
    return this.session.computedStyle(
      MENU_OVERLAY_TEST_IDS.overlay,
      'background-color'
    );
  }
}
