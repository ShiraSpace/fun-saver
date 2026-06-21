import { render, screen } from '@/test-support/render';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { CreateAccount } from './CreateAccount';
import { NAME_FIELD_TEST_IDS } from './NameField/constants';
import { CREATE_ACCOUNT_COPY, CREATE_ACCOUNT_TEST_IDS } from './constants';

describe('CreateAccount', () => {
  beforeEach(() => {
    render(<CreateAccount />);
  });

  it('shows the create-account title', () => {
    expect(screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.title)).toHaveTextContent(
      CREATE_ACCOUNT_COPY.title
    );
  });

  it('renders the name field', () => {
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.field)).toBeInTheDocument();
  });

  it('renders the avatar picker', () => {
    expect(
      screen.getByTestId(AVATAR_PICKER_TEST_IDS.container)
    ).toBeInTheDocument();
  });
});
