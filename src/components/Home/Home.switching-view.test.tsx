import { Fragment, JSX, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import {
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_MOTION,
  VIEW_MODE_SWITCH_TEST_IDS,
} from '@/components/Menu/ViewModeSwitch/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { APP_VIEW_MODE, type AppViewMode } from '@/lib/account/view-mode';
import type { AccountSummary } from '@/lib/account/types';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { Home } from './Home';
import { accounts, openMenu, renderHome } from './home-test-helpers';

function accountsInViewMode(viewMode: AppViewMode): AccountSummary[] {
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
    setServerAccounts(accountsInViewMode(APP_VIEW_MODE.child));
  const serverSaysParent = (): void =>
    setServerAccounts(accountsInViewMode(APP_VIEW_MODE.parent));

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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function tapViewModeSwitch(): void {
  fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
}

describe('Home switching between the parent and child screens', () => {
  describe('a parent turns child view on and the save has not answered yet', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
      renderHome();
      openMenu();
      tapViewModeSwitch();
      await act(() => wait(VIEW_MODE_SWITCH_MOTION.slideMs * 2));
    });

    it('keeps the menu open until the save answers', () => {
      expect(screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)).toHaveAttribute(
        'data-open',
        'true'
      );
    });
  });

  describe('a parent turns child view on and the menu starts closing', () => {
    beforeEach(async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      renderHome();
      openMenu();
      tapViewModeSwitch();
      await waitFor(() =>
        expect(
          screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)
        ).toHaveAttribute('data-open', 'false')
      );
    });

    it('keeps the parent screen while the menu fades away', () => {
      expect(
        screen.queryByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).not.toBeInTheDocument();
    });
  });

  describe('a parent turns child view on and the save fails', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderHome();
      openMenu();
      tapViewModeSwitch();
      await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError);
    });

    it('stays on the parent screen', () => {
      expect(
        screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction)
      ).toBeInTheDocument();
    });

    it('shows the error in the menu that is still open', () => {
      expect(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });
  });

  describe('the view is changed somewhere else after a parent turned child view on', () => {
    beforeEach(async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      render(<HomeWithServerAccounts />, { user: mockUser });
      openMenu();
      tapViewModeSwitch();
      await screen.findByTestId(CHILD_ACCOUNT_TEST_IDS.screen);
      fireEvent.click(screen.getByTestId(SERVER_SAYS_TEST_IDS.child));
      fireEvent.click(screen.getByTestId(SERVER_SAYS_TEST_IDS.parent));
    });

    it('follows the saved view rather than the earlier choice', () => {
      expect(
        screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction)
      ).toBeInTheDocument();
    });
  });
});
