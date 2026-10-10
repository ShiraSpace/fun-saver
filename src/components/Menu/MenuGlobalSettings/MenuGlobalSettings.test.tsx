import { render, screen } from '@/test-utils/render';
import { mockAccountsContext } from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import { VIEW_MODE_SWITCH_TEST_IDS } from '../ViewModeSwitch/constants';
import { MenuGlobalSettings } from './MenuGlobalSettings';
import {
  MENU_GLOBAL_SETTINGS_COPY,
  MENU_GLOBAL_SETTINGS_TEST_IDS,
} from './constants';

describe('MenuGlobalSettings', () => {
  beforeEach(() => {
    render(
      <WithMenu>
        <MenuGlobalSettings />
      </WithMenu>,
      { accounts: mockAccountsContext }
    );
  });

  it('heads the block as settings for every child on this phone', () => {
    expect(
      screen.getByTestId(MENU_GLOBAL_SETTINGS_TEST_IDS.heading)
    ).toHaveTextContent(MENU_GLOBAL_SETTINGS_COPY.heading);
  });

  it('holds the parent/child switch', () => {
    expect(
      screen.getByTestId(MENU_GLOBAL_SETTINGS_TEST_IDS.block)
    ).toContainElement(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
  });
});
