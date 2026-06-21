import { render, screen } from '@/test-support/render';
import { Avatar } from './Avatar';
import { AVATAR_TEST_IDS } from './constants';

describe('Avatar', () => {
  it('renders the avatar image at a fixed size', () => {
    render(
      <Avatar
        avatarId="kid-03"
        alt="נועה"
        size={46}
        testId={AVATAR_TEST_IDS.image}
      />
    );

    const image = screen.getByTestId(AVATAR_TEST_IDS.image);
    expect(image).toHaveAttribute('src', expect.stringContaining('kid-03'));
    expect(image).toHaveAttribute('alt', 'נועה');
    expect(image).toHaveAttribute('width', '46');
    expect(image).toHaveAttribute('height', '46');
  });

  it('renders the avatar image filling its parent in fill mode', () => {
    render(
      <Avatar
        avatarId="kid-08"
        alt="מתן"
        fill
        sizes="46px"
        testId={AVATAR_TEST_IDS.image}
      />
    );

    const image = screen.getByTestId(AVATAR_TEST_IDS.image);
    expect(image).toHaveAttribute('src', expect.stringContaining('kid-08'));
    expect(image).toHaveAttribute('data-nimg', 'fill');
    expect(image).not.toHaveAttribute('width');
  });
});
