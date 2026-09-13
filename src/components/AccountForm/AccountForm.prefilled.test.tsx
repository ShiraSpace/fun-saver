import { render, screen } from '@/test-utils/render';
import {
  chosenAvatars,
  nameInput,
  submitForm,
} from '@/test-utils/account-form';
import { AccountForm } from './AccountForm';
import { ACCOUNT_FORM_TEST_IDS } from './constants';

const mockForm = {
  testId: 'account-form-under-test',
  title: 'עריכת חשבון',
  titleIcon: '✏️',
  submitLabel: '✓ שמירת שינויים',
  name: 'רוני',
  avatarId: 'kid-07',
};

const mockOnSubmit = jest.fn();

describe('AccountForm — opened on an existing account', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    render(
      <AccountForm
        data-testid={mockForm.testId}
        title={mockForm.title}
        titleIcon={mockForm.titleIcon}
        submitLabel={mockForm.submitLabel}
        initialName={mockForm.name}
        initialAvatarId={mockForm.avatarId}
        onSubmit={mockOnSubmit}
      />
    );
  });

  it('opens pre-filled and ready to submit', () => {
    expect(nameInput()).toHaveValue(mockForm.name);
    expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit)).toBeEnabled();
  });

  it('marks the initial avatar as the selected one', () => {
    const selected = chosenAvatars();

    expect(selected).toHaveLength(1);
    expect(
      selected[0].querySelector(`img[alt="${mockForm.avatarId}"]`)
    ).toBeInTheDocument();
  });

  it('submits the initial values untouched', () => {
    submitForm();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: mockForm.name,
      avatarId: mockForm.avatarId,
    });
  });

  it('renders no close button without onCancel', () => {
    expect(
      screen.queryByTestId(ACCOUNT_FORM_TEST_IDS.cancel)
    ).not.toBeInTheDocument();
  });
});
