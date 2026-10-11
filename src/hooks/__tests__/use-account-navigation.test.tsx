import { JSX, ReactNode } from 'react';
import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { APP_MODE } from '@/components/AccountManagement/app-mode-context';
import type { AccountSummary } from '@/lib/account/types';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockAccountSavingForGoal } from '@/test-utils/mocks/goal.mocks';
import { AppThemeProvider } from '@/theme/AppThemeProvider';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import {
  useAccountNavigation,
  type AccountNavigation,
} from '../use-account-navigation';

interface NavigationProps {
  accounts: AccountSummary[];
}

interface WithThemeProps {
  children: ReactNode;
}

function WithTheme({ children }: WithThemeProps): JSX.Element {
  return (
    <AppThemeProvider initialThemeId={DEFAULT_THEME_ID}>
      {children}
    </AppThemeProvider>
  );
}

describe('useAccountNavigation', () => {
  describe('while viewing the goal of an account saving for it', () => {
    let navigation: RenderHookResult<AccountNavigation, NavigationProps>;

    beforeEach(() => {
      navigation = renderHook(
        ({ accounts }) =>
          useAccountNavigation(accounts, mockAccountSavingForGoal.id),
        {
          initialProps: { accounts: [mockAccountSavingForGoal] },
          wrapper: WithTheme,
        }
      );
      act(() => navigation.result.current.setMode(APP_MODE.viewingGoal));
    });

    it('names the account', () => {
      expect(navigation.result.current.goalBeingViewed?.accountName).toBe(
        mockAccountSavingForGoal.name
      );
    });

    it("carries what is saved toward the account's goal", () => {
      expect(
        navigation.result.current.goalBeingViewed?.savedTowardGoal.goal
      ).toEqual(mockAccountSavingForGoal.goal);
    });

    describe('when a refresh brings the account back without a goal', () => {
      beforeEach(() => {
        navigation.rerender({ accounts: [mockAccountSummary] });
      });

      it('returns to viewing', () => {
        expect(navigation.result.current.mode).toBe(APP_MODE.viewing);
      });
    });
  });
});
