import { render, screen } from '@/test-utils/render';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { AVATARS } from '@/lib/avatars';
import { AvatarPicker } from './AvatarPicker';
import { AVATAR_PICKER_TEST_IDS } from './constants';

describe('AvatarPicker', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    render(<AvatarPicker selectedId={null} onSelect={mockOnSelect} />);
  });

  it('renders an option for every avatar', () => {
    expect(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)).toHaveLength(
      AVATARS.length
    );
  });

  describe.each([THEME_ID.jungleQuest, THEME_ID.midnightBlue] as const)(
    'on %s, where the old ring vanished into a layer',
    (themeId) => {
      const { selectionRing } = getThemeTokens(themeId).colors;

      beforeEach(() => {
        render(
          <AvatarPicker selectedId={AVATARS[0].id} onSelect={mockOnSelect} />,
          { themeId }
        );
      });

      it('rings the selected avatar in a colour neither layer hides', () => {
        const selected = screen
          .getAllByTestId(AVATAR_PICKER_TEST_IDS.option)
          .filter((option) => option.dataset.selected === 'true');

        expect(selected).toHaveLength(1);
        expect(getComputedStyle(selected[0]).boxShadow).toContain(
          selectionRing
        );
      });
    }
  );
});
