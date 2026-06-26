import { fireEvent, render, screen, waitFor } from '@/test-support/render';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { mockAccount, mockCreateAccountInput } from '@/test-support/fixtures';
import { CreateAccount } from './CreateAccount';
import { NAME_FIELD_TEST_IDS } from './NameField/constants';
import { CREATE_ACCOUNT_COPY, CREATE_ACCOUNT_TEST_IDS } from './constants';

const mockPush = jest.fn();
const mockCreateAccount = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { push: jest.Mock } => ({ push: mockPush }),
}));

jest.mock('./use-create-account', () => ({
  useCreateAccount: (): { createAccount: jest.Mock } => ({
    createAccount: mockCreateAccount,
  }),
}));

describe('CreateAccount', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockCreateAccount.mockReset().mockResolvedValue(mockAccount);
  });

  describe('default', () => {
    beforeEach(() => {
      render(<CreateAccount />);
    });

    it('shows the create-account title', () => {
      expect(
        screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.title)
      ).toHaveTextContent(CREATE_ACCOUNT_COPY.title);
    });

    it('renders the name field', () => {
      expect(screen.getByTestId(NAME_FIELD_TEST_IDS.field)).toBeInTheDocument();
    });

    it('renders the avatar picker', () => {
      expect(
        screen.getByTestId(AVATAR_PICKER_TEST_IDS.container)
      ).toBeInTheDocument();
    });

    it('shows the submit button', () => {
      expect(
        screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.submit)
      ).toHaveTextContent(CREATE_ACCOUNT_COPY.submit);
    });

    it('disables submit until a name and an avatar are chosen', () => {
      const submit = screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.submit);
      expect(submit).toBeDisabled();

      fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
        target: { value: 'נועה' },
      });
      expect(submit).toBeDisabled();

      fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
      expect(submit).toBeEnabled();
    });

    it('creates the account and navigates home on submit', async () => {
      fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
        target: { value: mockCreateAccountInput.name },
      });
      fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
      fireEvent.click(screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.submit));

      expect(mockCreateAccount).toHaveBeenCalledWith(mockCreateAccountInput);
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
    });
  });

  describe('with callbacks', () => {
    const mockOnCreated = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
      mockOnCreated.mockClear();
      mockOnCancel.mockClear();
      render(
        <CreateAccount onCreated={mockOnCreated} onCancel={mockOnCancel} />
      );
    });

    it('calls onCancel when the close button is tapped', () => {
      fireEvent.click(screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.cancel));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCreated with the new account instead of navigating', async () => {
      fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
        target: { value: mockCreateAccountInput.name },
      });
      fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
      fireEvent.click(screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.submit));

      await waitFor(() =>
        expect(mockOnCreated).toHaveBeenCalledWith(mockAccount)
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
