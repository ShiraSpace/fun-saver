import { render, screen } from '@/test-utils/render';
import {
  selectFirstAvatar,
  submitForm,
  fillName,
} from '@/test-utils/account-form';
import { AccountForm } from './AccountForm';
import { ACCOUNT_FORM_TEST_IDS } from './constants';
import { CLOSE_BUTTON_TEST_IDS } from '@/components/CloseButton/constants';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('AccountForm saving', () => {
  beforeEach(() => {
    mockOnSubmit.mockReset();
    render(
      <AccountForm
        data-testid="account-form-under-test"
        title="עריכת חשבון"
        submitLabel="✓ שמירת שינויים"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    fillName('רוני');
    selectFirstAvatar();
  });

  it('locks cancel while the save is pending', () => {
    mockOnSubmit.mockReturnValueOnce(new Promise(() => {}));
    submitForm();

    expect(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button)).toBeDisabled();
  });

  it('unlocks cancel once the save fails', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('nope'));
    submitForm();
    await screen.findByTestId(ACCOUNT_FORM_TEST_IDS.saveError);

    expect(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button)).toBeEnabled();
  });
});
