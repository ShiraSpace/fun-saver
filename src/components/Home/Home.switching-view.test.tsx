import { Fragment, JSX, useState } from 'react';
import { act, fireEvent, render, screen } from '@/test-utils/render';
import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import {
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_MOTION,
  VIEW_MODE_SWITCH_TEST_IDS,
} from '@/components/Menu/ViewModeSwitch/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import {
  MENU_OVERLAY_STYLE,
  MENU_OVERLAY_TEST_IDS,
} from '@/components/Menu/MenuOverlay/constants';
import { openAccountPicker } from '@/test-utils/account-picker';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';
import type { AccountSummary } from '@/lib/account/types';
import { wait } from '@/lib/wait';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { Home } from './Home';
import { accounts, openMenu } from './home-test-helpers';

function accountsInViewMode(viewMode: ViewMode): AccountSummary[] {
  return accounts.map((account) =>
    account.id === mockAccount.id ? { ...account, viewMode } : account
  );
}

const SERVER_SAYS_TEST_IDS = {
  child: 'server-says-child',
  parent: 'server-says-parent',
} as const;

function HomeWithServerAccounts(): JSX.Element {
  const [serverAccounts, setServerAccounts] = useState(accounts);
  const serverSaysChild = (): void =>
    setServerAccounts(accountsInViewMode(VIEW_MODE.child));
  const serverSaysParent = (): void =>
    setServerAccounts(accountsInViewMode(VIEW_MODE.parent));

  return (
    <Fragment>
      <button
        data-testid={SERVER_SAYS_TEST_IDS.child}
        onClick={serverSaysChild}
      />
      <button
        data-testid={SERVER_SAYS_TEST_IDS.parent}
        onClick={serverSaysParent}
      />
      <Home accounts={serverAccounts} initialAccountId={mockAccount.id} />
    </Fragment>
  );
}

function renderHomeWithServer(): void {
  render(<HomeWithServerAccounts />, { user: mockUser });
}

function turnCurrentAccountChildViewOn(): void {
  openMenu();
  openAccountPicker();
  fireEvent.click(
    screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.childViewToggle)[0]
  );
}

function serverSays(viewMode: ViewMode): void {
  fireEvent.click(screen.getByTestId(SERVER_SAYS_TEST_IDS[viewMode]));
}

function tapMenuButton(): void {
  fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
}

function createPendingSave(): {
  save: Promise<unknown>;
  answerSave: () => void;
} {
  const { promise, resolve } = Promise.withResolvers<unknown>();
  const answerSave = (): void =>
    resolve({ ok: true, json: async () => mockAccount });

  return { save: promise, answerSave };
}

function saveAnswers(): Promise<void> {
  return act(() => wait(VIEW_MODE_SWITCH_MOTION.slideMs * 2));
}

function menuOverlay(): HTMLElement {
  return screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay);
}

describe('Home switching between the parent and child screens', () => {
  describe("the current account's child view is saved", () => {
    beforeEach(async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      renderHomeWithServer();
      turnCurrentAccountChildViewOn();
      await saveAnswers();
      serverSays(VIEW_MODE.child);
    });

    it('keeps the menu open', () => {
      expect(menuOverlay()).toHaveAttribute('data-open', 'true');
    });

    it('keeps the parent screen while the menu is open', () => {
      expect(
        screen.queryByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).not.toBeInTheDocument();
    });

    describe('and the menu closes', () => {
      beforeEach(() => {
        tapMenuButton();
      });

      it('shows the child screen', async () => {
        expect(
          await screen.findByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
        ).toBeInTheDocument();
      });
    });
  });

  describe("the current account's child view fails to save", () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderHomeWithServer();
      turnCurrentAccountChildViewOn();
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);
    });

    it('shows no child screen once the menu closes', async () => {
      tapMenuButton();
      await act(() => wait(MENU_OVERLAY_STYLE.transitionMs * 2));

      expect(
        screen.queryByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).not.toBeInTheDocument();
    });

    it('shows the error in the menu that is still open', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });
  });

  describe('a parent closes the menu before the save answers', () => {
    beforeEach(() => {
      const { save, answerSave } = createPendingSave();
      global.fetch = jest.fn().mockReturnValue(save);
      renderHomeWithServer();
      turnCurrentAccountChildViewOn();
      tapMenuButton();
      answerSave();
    });

    it('still shows the child screen once the save answers', async () => {
      expect(
        await screen.findByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).toBeInTheDocument();
    });
  });

  describe('the view is changed somewhere else after a parent turned child view on', () => {
    beforeEach(async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      renderHomeWithServer();
      turnCurrentAccountChildViewOn();
      await saveAnswers();
      serverSays(VIEW_MODE.child);
      tapMenuButton();
      await screen.findByTestId(CHILD_ACCOUNT_TEST_IDS.screen);
      serverSays(VIEW_MODE.parent);
    });

    it('follows the saved view rather than the earlier choice', () => {
      expect(
        screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction)
      ).toBeInTheDocument();
    });
  });
});
