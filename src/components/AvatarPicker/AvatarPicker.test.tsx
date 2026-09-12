import { render, screen } from '@/test-support/render';
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
});
