import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { WithMenu } from '@/test-utils/menu';
import { MenuBody } from './MenuBody';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from '../AccountPicker/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '../EditAccountButton/constants';
import { MENU_ACCOUNT_SCOPE_TEST_IDS } from '../MenuAccountScope/constants';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from '../MenuGlobalScope/constants';

describe('MenuBody', () => {
  describe('for a parent who has no account yet', () => {
    beforeEach(() => {
      render(
        <WithMenu>
          <MenuBody />
        </WithMenu>,
        { user: mockUser }
      );
    });

    it('offers to start an account where the picker would stand', () => {
      expect(
        screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block)
      ).toContainElement(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));
    });

    it('shows nothing that belongs to an account, there being none', () => {
      expect(
        screen.queryByTestId(ACCOUNT_PICKER_TEST_IDS.picker)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(MENU_ACCOUNT_SCOPE_TEST_IDS.block)
      ).not.toBeInTheDocument();
    });
  });
});
