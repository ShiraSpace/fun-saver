import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { MenuGlobalScope } from './MenuGlobalScope';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from './constants';
import { PROFILE_SECTION_TEST_IDS } from '../ProfileSection/constants';

const BELOW_THE_STRIP = 'below-the-profile-strip';

describe('MenuGlobalScope', () => {
  beforeEach(() => {
    render(
      <MenuGlobalScope>
        <span data-testid={BELOW_THE_STRIP} />
      </MenuGlobalScope>,
      { user: mockUser }
    );
  });

  it('names the signed-in parent, who belongs to no one account', () => {
    expect(
      screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block)
    ).toContainElement(screen.getByTestId(PROFILE_SECTION_TEST_IDS.strip));
  });

  it('holds whatever the menu puts under them', () => {
    expect(
      screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block)
    ).toContainElement(screen.getByTestId(BELOW_THE_STRIP));
  });
});
