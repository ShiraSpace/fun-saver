import { render, screen } from '@/test-utils/render';
import { getThemeTokens } from '@/theme/registry';
import { AVATARS } from '@/lib/avatars';
import { AvatarPicker } from './AvatarPicker';
import { AVATAR_PICKER_TEST_IDS } from './constants';

describe('AvatarPicker', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
    render(<AvatarPicker selectedId={null} onSelect={onSelect} />);
  });

  it('renders an option for every avatar', () => {
    expect(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)).toHaveLength(
      AVATARS.length
    );
  });

  describe('on the theme whose primary is the gradient it lands on', () => {
    const jungle = getThemeTokens('jungle-quest').colors;

    beforeEach(() => {
      render(
        <AvatarPicker selectedId={AVATARS[0].id} onSelect={onSelect} />,
        'jungle-quest'
      );
    });

    it('rings the selected avatar in a colour the gradient does not hide', () => {
      const selected = screen
        .getAllByTestId(AVATAR_PICKER_TEST_IDS.option)
        .filter((option) => option.dataset.selected === 'true');

      expect(selected).toHaveLength(1);
      expect(getComputedStyle(selected[0]).boxShadow).toContain(
        jungle.textOnPot
      );
    });
  });
});
