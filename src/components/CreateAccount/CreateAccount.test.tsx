import { render, screen } from '@/test-support/render';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { CreateAccount } from './CreateAccount';
import { CREATE_ACCOUNT_TEST_IDS } from './constants';

describe('CreateAccount', () => {
  beforeEach(() => {
    render(<CreateAccount />);
  });

  it('renders the account name input', () => {
    expect(
      screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.nameInput)
    ).toBeInTheDocument();
  });

  it('renders the avatar picker', () => {
    expect(
      screen.getByTestId(AVATAR_PICKER_TEST_IDS.container)
    ).toBeInTheDocument();
  });
});
