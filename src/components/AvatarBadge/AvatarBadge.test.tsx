import { render, screen } from '@/test-support/render';
import { AvatarBadge } from './AvatarBadge';

describe('AvatarBadge', () => {
  const TEST_ID = 'badge-avatar';

  it('renders the avatar image for the given id', () => {
    render(
      <AvatarBadge avatarId="kid-03" alt="kid" size={40} testId={TEST_ID} />
    );

    expect(screen.getByTestId(TEST_ID)).toHaveAttribute(
      'src',
      expect.stringContaining('kid-03')
    );
  });
});
