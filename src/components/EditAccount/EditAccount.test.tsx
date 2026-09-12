import { fireEvent, render, screen, waitFor } from '@/test-support/render';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import {
  ACCOUNT_FORM_COPY,
  ACCOUNT_FORM_TEST_IDS,
} from '@/components/AccountForm/constants';
import { NAME_FIELD_TEST_IDS } from '@/components/AccountForm/NameField/constants';
import { AVATARS } from '@/lib/avatars';
import { mockAccount, mockAccountEdit } from '@/test-support/fixtures';
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

  it('opens on the edit-account screen with its own title and label', () => {
    expect(
      screen.getByTestId(EDIT_ACCOUNT_TEST_IDS.container)
    ).toBeInTheDocument();
    expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
      EDIT_ACCOUNT_COPY.title
    );
    expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit)).toHaveTextContent(
      EDIT_ACCOUNT_COPY.submit
    );
  });

  it('opens pre-filled with the account it was given', () => {
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveValue(
      mockAccount.name
    );

    const selected = screen
      .getAllByTestId(AVATAR_PICKER_TEST_IDS.option)
      .filter((option) => option.dataset.selected === 'true');

    expect(selected).toHaveLength(1);
    expect(
      selected[0].querySelector(`img[alt="${mockAccount.avatarId}"]`)
    ).toBeInTheDocument();
  });

  it('saves the edited name and avatar against the account id', async () => {
    fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
      target: { value: mockAccountEdit.name },
    });
    fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
    fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit));

    expect(mockUpdateAccount).toHaveBeenCalledWith(mockAccount.id, {
      name: mockAccountEdit.name,
      avatarId: AVATARS[0].id,
    });
    await waitFor(() => expect(mockOnUpdated).toHaveBeenCalledTimes(1));
  });

  it('saves an untouched form as the values it opened with', async () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit));

    expect(mockUpdateAccount).toHaveBeenCalledWith(mockAccount.id, {
      name: mockAccount.name,
      avatarId: mockAccount.avatarId,
    });
    await waitFor(() => expect(mockOnUpdated).toHaveBeenCalledTimes(1));
  });

  it('keeps the form open and says so when the save fails', async () => {
    mockUpdateAccount.mockRejectedValue(new Error('nope'));

    fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit));

    expect(
      await screen.findByTestId(ACCOUNT_FORM_TEST_IDS.saveError)
    ).toHaveTextContent(ACCOUNT_FORM_COPY.saveError);
    expect(mockOnUpdated).not.toHaveBeenCalled();
  });

  it('cancels without saving', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.cancel));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockUpdateAccount).not.toHaveBeenCalled();
  });
});
