import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import {
  mockAccount,
  mockCreateAccountInput,
} from '@/test-utils/mocks/account.mocks';
import { CreateAccount } from './CreateAccount';
import { NAME_FIELD_TEST_IDS } from '@/components/AccountForm/NameField/constants';
import {
  ACCOUNT_FORM_COPY,
  ACCOUNT_FORM_TEST_IDS,
} from '@/components/AccountForm/constants';
import { CREATE_ACCOUNT_COPY } from './constants';
import { mockRouter } from '@mocks/next/navigation';

const mockCreateAccount = jest.fn();

jest.mock('./use-create-account', () => ({
  useCreateAccount: (): { createAccount: jest.Mock } => ({
    createAccount: mockCreateAccount,
  }),
}));

function fillAndSubmit(name: string): void {
  fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
    target: { value: name },
  });
  fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
  fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit));
}

describe('CreateAccount', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
    mockCreateAccount.mockReset().mockResolvedValue(mockAccount);
  });

  describe('default', () => {
    beforeEach(() => {
      render(<CreateAccount />);
    });

    it('shows the create-account title', () => {
      expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
        CREATE_ACCOUNT_COPY.title
      );
    });

    it('shows the create icon beside the title', () => {
      expect(
        screen.getByTestId(ACCOUNT_FORM_TEST_IDS.titleIcon)
      ).toHaveTextContent(CREATE_ACCOUNT_COPY.titleIcon);
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
        screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit)
      ).toHaveTextContent(CREATE_ACCOUNT_COPY.submit);
    });

    it('disables submit until a name and an avatar are chosen', () => {
      const submit = screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit);
      expect(submit).toBeDisabled();

      fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
        target: { value: 'נועה' },
      });
      expect(submit).toBeDisabled();

      fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
      expect(submit).toBeEnabled();
    });

    it('stays put and says so when the create fails', async () => {
      mockCreateAccount.mockRejectedValue(new Error('nope'));

      fillAndSubmit(mockCreateAccountInput.name);

      expect(
        await screen.findByTestId(ACCOUNT_FORM_TEST_IDS.saveError)
      ).toHaveTextContent(ACCOUNT_FORM_COPY.saveError);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('creates the account and navigates home on submit', async () => {
      fillAndSubmit(mockCreateAccountInput.name);

      expect(mockCreateAccount).toHaveBeenCalledWith(mockCreateAccountInput);
      await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/'));
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

    it('calls onCancel when the cancel button is tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.cancel));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCreated with the new account instead of navigating', async () => {
      fillAndSubmit(mockCreateAccountInput.name);

      await waitFor(() =>
        expect(mockOnCreated).toHaveBeenCalledWith(mockAccount)
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
