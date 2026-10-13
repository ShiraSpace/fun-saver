import { act, renderHook, waitFor, type RenderHookResult } from '@/test-utils/render';
import type { AccountSummary } from '@/lib/account/types';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockAccountSavingForGoal } from '@/test-utils/mocks/goal.mocks';
import { APP_MODE } from '@/components/AccountManagement/app-mode-context';
import { holdRefresh, useHeldRefresh, type HeldRefresh } from '@/test-utils/held-refresh';
import { useIsLoaderShown } from '../loader-context';
import { useAccountNavigation, type AccountNavigation } from '../use-account-navigation';

interface AccountNavigationWithLoader extends AccountNavigation {
  isLoaderShown: boolean;
}

describe('useAccountNavigation', () => {
  describe('when an edit is finished', () => {
    let mockHeldRefresh: HeldRefresh;
    let hook: RenderHookResult<AccountNavigationWithLoader, void>;

    beforeEach(async () => {
      mockHeldRefresh = holdRefresh();
      hook = renderHook(() => {
        useHeldRefresh(mockHeldRefresh);

        return {
          ...useAccountNavigation([mockAccountSummary], mockAccountSummary.id),
          isLoaderShown: useIsLoaderShown(),
        };
      });

      act(() => hook.result.current.setMode(APP_MODE.editingAccount));
      await act(async () => hook.result.current.finishEditing());
    });

    it('shows the loader while the new page data is on its way', async () => {
      await waitFor(() => expect(hook.result.current.isLoaderShown).toBe(true));
    });

    it('is back to viewing before the new page data arrives', () => {
      expect(hook.result.current.mode).toBe(APP_MODE.viewing);
    });

    it('hides the loader once the new page data has arrived', async () => {
      await mockHeldRefresh.release();

      await waitFor(() => expect(hook.result.current.isLoaderShown).toBe(false));
    });
  });

  it('gives the current account as the one setting a goal while setting one', () => {
    const { result } = renderHook(() =>
      useAccountNavigation([mockAccountSummary], mockAccountSummary.id)
    );

    act(() => result.current.setMode(APP_MODE.settingGoal));

    expect(result.current.accountSettingGoal).toBe(mockAccountSummary);
  });

  describe('while viewing the goal of an account saving for it', () => {
    let mockAccounts: AccountSummary[];
    let hook: RenderHookResult<AccountNavigation, void>;

    beforeEach(() => {
      mockAccounts = [mockAccountSavingForGoal];
      hook = renderHook(() => useAccountNavigation(mockAccounts, mockAccountSavingForGoal.id));
      act(() => hook.result.current.setMode(APP_MODE.viewingGoal));
    });

    it('names the account', () => {
      expect(hook.result.current.goalBeingViewed?.accountName).toBe(mockAccountSavingForGoal.name);
    });

    it("carries what is saved toward the account's goal", () => {
      expect(hook.result.current.goalBeingViewed?.savedTowardGoal.goal).toEqual(
        mockAccountSavingForGoal.goal
      );
    });

    describe('when a refresh brings the account back without a goal', () => {
      beforeEach(() => {
        mockAccounts = [mockAccountSummary];
        hook.rerender();
      });

      it('returns to viewing', () => {
        expect(hook.result.current.mode).toBe(APP_MODE.viewing);
      });
    });
  });
});
