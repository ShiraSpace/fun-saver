import { render, screen } from '@/test-utils/render';
import { mockMenu, mockUser } from '@/test-utils/fixtures';
import { MenuProvider } from '../use-menu-state';
import { MenuGlobalScope } from './MenuGlobalScope';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from './constants';
import { PROFILE_SECTION_TEST_IDS } from '../ProfileSection/constants';

const BELOW_THE_STRIP = 'below-the-profile-strip';

describe('MenuGlobalScope', () => {
  let block: HTMLElement;

  beforeEach(() => {
    render(
      <MenuProvider value={mockMenu}>
        <MenuGlobalScope>
          <span data-testid={BELOW_THE_STRIP} />
        </MenuGlobalScope>
      </MenuProvider>,
      { user: mockUser }
    );

    block = screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block);
  });

  it('names the signed-in parent, who belongs to no one account', () => {
    expect(block).toContainElement(
      screen.getByTestId(PROFILE_SECTION_TEST_IDS.strip)
    );
  });

  it('holds whatever the menu puts under them', () => {
    expect(block).toContainElement(screen.getByTestId(BELOW_THE_STRIP));
  });
});
