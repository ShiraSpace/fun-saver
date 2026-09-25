import { render, screen, waitFor } from '@/test-utils/render';
import {
  ACCOUNT_FORM_COPY,
  ACCOUNT_FORM_TEST_IDS,
} from '@/components/AccountForm/constants';
import {
  cancelForm,
  selectedAvatars,
  nameInput,
  selectAvatar,
  submitForm,
  fillName,
} from '@/test-utils/account-form';
import {
  mockAccount,
  mockAccountEdits,
} from '@/test-utils/mocks/account.mocks';
import { EditAccount } from './EditAccount';
import { EDIT_ACCOUNT_COPY, EDIT_ACCOUNT_TEST_IDS } from './constants';

const mockUpdateAccount = jest.fn();
const mockOnUpdated = jest.fn();
const mockOnCancel = jest.fn();

jest.mock('./use-update-account', () => ({
  useUpdateAccount: (): { updateAccount: jest.Mock } => ({
    updateAccount: mockUpdateAccount,
  }),
}));

describe('EditAccount', () => {
  beforeEach(() => {
    mockUpdateAccount.mockReset().mockResolvedValue(mockAccount);
    mockOnUpdated.mockClear();
    mockOnCancel.mockClear();
    render(
      <EditAccount
        account={mockAccount}
        onUpdated={mockOnUpdated}
        onCancel={mockOnCancel}
      />
    );
  });

  it('opens on the edit-account screen', () => {
    expect(
      screen.getByTestId(EDIT_ACCOUNT_TEST_IDS.container)
    ).toBeInTheDocument();
  });

  it('titles the form for editing rather than creating', () => {
    expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
      EDIT_ACCOUNT_COPY.title
    );
  });

  it('labels the button for saving rather than creating', () => {
    expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit)).toHaveTextContent(
      EDIT_ACCOUNT_COPY.submit
    );
  });

  it('opens with the name already typed in', () => {
    expect(nameInput()).toHaveValue(mockAccount.name);
  });

  it('opens with the account avatar already chosen', () => {
    const selected = selectedAvatars();

    expect(selected).toHaveLength(1);
    expect(
      selected[0].querySelector(`img[alt="${mockAccount.avatarId}"]`)
    ).toBeInTheDocument();
  });

  it('saves the edited values against the account id', () => {
    fillName(mockAccountEdits.name);
    selectAvatar(mockAccountEdits.avatarId);
    submitForm();

    expect(mockUpdateAccount).toHaveBeenCalledWith(mockAccount.id, {
      name: mockAccountEdits.name,
      avatarId: mockAccountEdits.avatarId,
    });
  });

  it('saves an untouched form as the values it opened with', () => {
    submitForm();

    expect(mockUpdateAccount).toHaveBeenCalledWith(mockAccount.id, {
      name: mockAccount.name,
      avatarId: mockAccount.avatarId,
    });
  });

  it('tells the caller once the save lands', async () => {
    submitForm();

    await waitFor(() => expect(mockOnUpdated).toHaveBeenCalledTimes(1));
  });

  it('says so when the save fails', async () => {
    mockUpdateAccount.mockRejectedValue(new Error('nope'));

    submitForm();

    expect(
      await screen.findByTestId(ACCOUNT_FORM_TEST_IDS.saveError)
    ).toHaveTextContent(ACCOUNT_FORM_COPY.saveError);
  });

  it('does not tell the caller when the save fails', async () => {
    mockUpdateAccount.mockRejectedValue(new Error('nope'));

    submitForm();

    await screen.findByTestId(ACCOUNT_FORM_TEST_IDS.saveError);
    expect(mockOnUpdated).not.toHaveBeenCalled();
  });

  it('calls onCancel from the cancel button', () => {
    cancelForm();

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('saves nothing when cancelled', () => {
    cancelForm();

    expect(mockUpdateAccount).not.toHaveBeenCalled();
  });
});
