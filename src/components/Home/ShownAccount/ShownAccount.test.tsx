import { render, screen } from '@/test-utils/render';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';
import {
  mockAccountSummary,
  mockAccountsContext,
} from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { ShownAccount } from './ShownAccount';

interface ShownAccountScene {
  viewMode: ViewMode;
  savedViewMode: ViewMode;
}

function renderShownAccount({
  viewMode,
  savedViewMode,
}: ShownAccountScene): void {
  render(
    <ShownAccount
      account={{ ...mockAccountSummary, viewMode: savedViewMode }}
    />,
    { accounts: mockAccountsContext, user: mockUser, viewMode }
  );
}

describe('ShownAccount', () => {
  describe('in child mode, for an account saved in parent view', () => {
    beforeEach(() => {
      renderShownAccount({
        viewMode: VIEW_MODE.child,
        savedViewMode: VIEW_MODE.parent,
      });
    });

    it('shows the child screen', () => {
      expect(
        screen.getByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).toBeInTheDocument();
    });

    it('hides the parent new-transaction button', () => {
      expect(
        screen.queryByTestId(ACCOUNT_TEST_IDS.newTransaction)
      ).not.toBeInTheDocument();
    });
  });

  describe('in parent mode, for an account saved in child view', () => {
    beforeEach(() => {
      renderShownAccount({
        viewMode: VIEW_MODE.parent,
        savedViewMode: VIEW_MODE.child,
      });
    });

    it('shows the parent new-transaction button', () => {
      expect(
        screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction)
      ).toBeInTheDocument();
    });

    it('does not show the child screen', () => {
      expect(
        screen.queryByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).not.toBeInTheDocument();
    });
  });
});
