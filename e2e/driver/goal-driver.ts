import type { WalletName } from '@/lib/wallet/types';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
import { GOAL_LINE_TEST_IDS } from '@/components/Account/WalletCard/GoalLine/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { WALLET_PICKER_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletPicker/constants';
import { WALLET_TILE_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletTile/constants';
import { LOCKED_SAVINGS_TEST_IDS } from '@/components/Account/TransactionDrawer/WithdrawalForm/LockedSavings/constants';
import { WITHDRAWAL_FORM_TEST_IDS } from '@/components/Account/TransactionDrawer/WithdrawalForm/constants';
import { MENU_GOAL_TEST_IDS } from '@/components/Menu/MenuGoal/constants';
import { VIEW_GOAL_TEST_IDS } from '@/components/Goal/ViewGoal/constants';
import { SAVINGS_OPEN_TEST_IDS } from '@/components/Goal/ViewGoal/SavingsOpen/constants';
import { CLOSE_BUTTON_TEST_IDS } from '@/components/CloseButton/constants';
import { SET_GOAL_TEST_IDS } from '@/components/Goal/SetGoal/constants';
import { GOAL_NAME_FIELD_TEST_IDS } from '@/components/Goal/GoalFields/GoalNameField/constants';
import { GOAL_AMOUNT_FIELD_TEST_IDS } from '@/components/Goal/GoalFields/GoalAmountField/constants';
import { GOAL_PICTURE_FIELD_TEST_IDS } from '@/components/Goal/GoalFields/GoalPictureField/constants';
import { SAVE_GOAL_BUTTON_TEST_IDS } from '@/components/Goal/GoalFields/SaveGoalButton/constants';
import { GOAL_PICTURE_SEARCH_TEST_IDS } from '@/components/Goal/GoalPictureSearch/constants';
import { PICTURE_TILE_TEST_IDS } from '@/components/Goal/GoalPictureSearch/PictureTiles/PictureTile/constants';
import { CHOOSE_BUTTON_TEST_IDS } from '@/components/Goal/GoalPictureSearch/ChooseButton/constants';
import {
  CELEBRATION_TEST_IDS,
  TRAVELLING_BORDER_ANGLE,
} from '@/components/Goal/Celebration/constants';
import { AppBrowser } from './app-browser';
import type { AccountDriver } from './account-driver';
import { holds } from './box-geometry';

export class GoalDriver {
  constructor(
    private readonly appBrowser: AppBrowser,
    private readonly account: AccountDriver
  ) {}

  goalLine(): Promise<string> {
    return this.appBrowser.text(GOAL_LINE_TEST_IDS.line);
  }

  tapGoalLine(): Promise<void> {
    return this.appBrowser.click(GOAL_LINE_TEST_IDS.line);
  }

  tapMenuGoal(): Promise<void> {
    return this.appBrowser.click(MENU_GOAL_TEST_IDS.row);
  }

  async openSetGoalFromGoalLine(): Promise<void> {
    await this.appBrowser.click(GOAL_LINE_TEST_IDS.setGoal);
    await this.appBrowser.waits.testId(SET_GOAL_TEST_IDS.container);
  }

  setGoalExists(): Promise<boolean> {
    return this.appBrowser.exists(SET_GOAL_TEST_IDS.container);
  }

  async fillGoal(goalName: string, amountShekels: number): Promise<void> {
    await this.appBrowser.type(GOAL_NAME_FIELD_TEST_IDS.input, goalName);
    await this.appBrowser.type(GOAL_AMOUNT_FIELD_TEST_IDS.input, String(amountShekels));
  }

  async saveGoal(): Promise<void> {
    await this.appBrowser.click(SAVE_GOAL_BUTTON_TEST_IDS.submit);
    await this.appBrowser.waits.testIdGone(SET_GOAL_TEST_IDS.container);
    await this.appBrowser.waits.testId(GOAL_LINE_TEST_IDS.line);
  }

  async openPictureSearch(): Promise<void> {
    await this.appBrowser.click(GOAL_PICTURE_FIELD_TEST_IDS.preview);
    await this.appBrowser.waits.testId(GOAL_PICTURE_SEARCH_TEST_IDS.sheet);
  }

  waitForPictureSearchGone(): Promise<void> {
    return this.appBrowser.waits.testIdGone(GOAL_PICTURE_SEARCH_TEST_IDS.sheet);
  }

  async chooseFirstPicture(): Promise<void> {
    await this.appBrowser.waits.anyTestId([PICTURE_TILE_TEST_IDS.pictureTile]);
    await this.appBrowser.clickNth(`[data-testid="${PICTURE_TILE_TEST_IDS.pictureTile}"]`, 0);
    await this.appBrowser.click(CHOOSE_BUTTON_TEST_IDS.button);
    await this.waitForPictureSearchGone();
  }

  waitForGoalScreen(): Promise<void> {
    return this.appBrowser.waits.testId(VIEW_GOAL_TEST_IDS.container);
  }

  waitForGoalScreenGone(): Promise<void> {
    return this.appBrowser.waits.testIdGone(VIEW_GOAL_TEST_IDS.container);
  }

  async celebrationShown(): Promise<boolean> {
    if (!(await this.appBrowser.exists(CELEBRATION_TEST_IDS.celebration))) {
      return false;
    }

    const display = await this.appBrowser.computedStyle(
      CELEBRATION_TEST_IDS.celebration,
      'display'
    );

    return display !== 'none';
  }

  travellingBorderAngle(): Promise<string> {
    return this.appBrowser.pseudoStyle(
      WALLET_CARD_TEST_IDS.card,
      '::before',
      TRAVELLING_BORDER_ANGLE
    );
  }

  waitForTravellingBorderToTurn(from: string): Promise<void> {
    return this.appBrowser.waits.pseudoStyleChange({
      testId: WALLET_CARD_TEST_IDS.card,
      pseudo: '::before',
      property: TRAVELLING_BORDER_ANGLE,
      from,
    });
  }

  async travellingBorderShown(): Promise<boolean> {
    const display = await this.appBrowser.pseudoStyle(
      WALLET_CARD_TEST_IDS.card,
      '::before',
      'display'
    );

    return display !== 'none';
  }

  goalScreenExists(): Promise<boolean> {
    return this.appBrowser.exists(VIEW_GOAL_TEST_IDS.container);
  }

  tapCloseGoalScreen(): Promise<void> {
    return this.appBrowser.click(CLOSE_BUTTON_TEST_IDS.button);
  }

  goalScreenSavingsOpen(): Promise<string> {
    return this.appBrowser.text(SAVINGS_OPEN_TEST_IDS.label);
  }

  savingsLockExists(): Promise<boolean> {
    return this.appBrowser.exists(WALLET_CARD_TEST_IDS.lock);
  }

  waitForSavingsLockGone(): Promise<void> {
    return this.appBrowser.waits.testIdGone(WALLET_CARD_TEST_IDS.lock);
  }

  async startWithdrawal(amountShekels: number): Promise<void> {
    await this.account.openTransactionDrawer();
    await this.account.switchToWithdrawal();
    await this.account.typeAmount(amountShekels);
  }

  pickWallet(walletName: WalletName): Promise<void> {
    return this.appBrowser.click(WALLET_PICKER_TEST_IDS.wallet(walletName));
  }

  submit(): Promise<void> {
    return this.appBrowser.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  lockedWalletCount(): Promise<number> {
    return this.appBrowser.count(WALLET_TILE_TEST_IDS.lock);
  }

  waitForLockedSavings(): Promise<void> {
    return this.appBrowser.waits.testId(LOCKED_SAVINGS_TEST_IDS.panel);
  }

  submitLabel(): Promise<string> {
    return this.appBrowser.text(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  completesGoalNoteExists(): Promise<boolean> {
    return this.appBrowser.exists(WITHDRAWAL_FORM_TEST_IDS.completesGoal);
  }

  waitForCompletesGoalNote(): Promise<void> {
    return this.appBrowser.waits.testId(WITHDRAWAL_FORM_TEST_IDS.completesGoal);
  }

  waitForOverdraft(): Promise<void> {
    return this.appBrowser.waits.testId(WITHDRAWAL_FORM_TEST_IDS.overdraft);
  }

  async submitShowsWhole(): Promise<boolean> {
    const drawer = await this.appBrowser.box(TRANSACTION_DRAWER_TEST_IDS.drawer);
    const submit = await this.appBrowser.box(TRANSACTION_DRAWER_TEST_IDS.submit);

    return holds(drawer, submit);
  }
}
