import {
  act,
  renderHook,
  waitFor,
  type RenderHookResult,
} from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { APP_MODE } from '@/components/AccountManagement/app-mode-context';
import {
  holdRefresh,
  useHeldRefresh,
  type HeldRefresh,
} from '@/test-utils/held-refresh';
import { useIsLoaderShown } from '../loader-context';
import {
  useAccountNavigation,
  type AccountNavigation,
} from '../use-account-navigation';

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

      await waitFor(() =>
        expect(hook.result.current.isLoaderShown).toBe(false)
      );
    });
  });
});
