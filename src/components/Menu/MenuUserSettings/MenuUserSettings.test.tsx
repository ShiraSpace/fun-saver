import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { WithMenu } from '@/test-utils/menu';
import { MenuUserSettings } from './MenuUserSettings';
import { MENU_USER_SETTINGS_TEST_IDS } from './constants';
import { SIGNED_IN_USER_SECTION_TEST_IDS } from '../SignedInUserSection/constants';

const BELOW_THE_STRIP = 'below-the-profile-strip';

describe('MenuUserSettings', () => {
  let block: HTMLElement;

  beforeEach(() => {
    render(
      <WithMenu>
        <MenuUserSettings>
          <span data-testid={BELOW_THE_STRIP} />
        </MenuUserSettings>
      </WithMenu>,
      { user: mockUser }
    );

    block = screen.getByTestId(MENU_USER_SETTINGS_TEST_IDS.block);
  });

  it('names the signed-in parent, who belongs to no one account', () => {
    expect(block).toContainElement(
      screen.getByTestId(SIGNED_IN_USER_SECTION_TEST_IDS.section)
    );
  });

  it('holds whatever the menu puts under them', () => {
    expect(block).toContainElement(screen.getByTestId(BELOW_THE_STRIP));
  });
});
