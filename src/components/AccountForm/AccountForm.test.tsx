import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import {
  selectedAvatars,
  nameInput,
  selectFirstAvatar,
  submitForm,
  fillName,
} from '@/test-utils/account-form';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { AVATARS } from '@/lib/avatars';
import { AccountForm } from './AccountForm';
import { NAME_FIELD_TEST_IDS } from './NameField/constants';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';

const mockForm = {
  testId: 'account-form-under-test',
  title: 'עריכת חשבון',
  titleIcon: '✏️',
  submitLabel: '✓ שמירת שינויים',
  name: 'רוני',
  avatarId: 'kid-07',
};

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

function failASave(): Promise<HTMLElement> {
  fillName(mockForm.name);
  selectFirstAvatar();
  submitForm();

  return screen.findByTestId(ACCOUNT_FORM_TEST_IDS.saveError);
}

describe('AccountForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  describe('empty form', () => {
    beforeEach(() => {
      render(
        <AccountForm
          data-testid={mockForm.testId}
          title={mockForm.title}
          titleIcon={mockForm.titleIcon}
          submitLabel={mockForm.submitLabel}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
    });

    it('shows the title and icon it was given', () => {
      expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
        mockForm.title
      );
      expect(
        screen.getByTestId(ACCOUNT_FORM_TEST_IDS.titleIcon)
      ).toHaveTextContent(mockForm.titleIcon);
    });

    it('renders the name field and the avatar picker', () => {
      expect(screen.getByTestId(NAME_FIELD_TEST_IDS.field)).toBeInTheDocument();
      expect(
        screen.getByTestId(AVATAR_PICKER_TEST_IDS.container)
      ).toBeInTheDocument();
    });

    it('shows the submit label it was given', () => {
      expect(
        screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit)
      ).toHaveTextContent(mockForm.submitLabel);
    });

    it('disables submit until a name and an avatar are chosen', () => {
      const submitButton = screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit);
      expect(submitButton).toBeDisabled();

      fillName(mockForm.name);
      expect(submitButton).toBeDisabled();

      selectFirstAvatar();
      expect(submitButton).toBeEnabled();
    });

    it('keeps submit disabled for a blank name', () => {
      fillName('   ');
      selectFirstAvatar();

      expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit)).toBeDisabled();
    });

    it('ignores a submit that beats the avatar choice', () => {
      fillName(mockForm.name);
      fireEvent.submit(
        screen
          .getByTestId(mockForm.testId)
          .querySelector('form') as HTMLFormElement
      );

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits the typed name and the chosen avatar', () => {
      fillName(mockForm.name);
      selectFirstAvatar();
      submitForm();

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: mockForm.name,
        avatarId: AVATARS[0].id,
      });
    });

    it('submits the name without the padding around it', () => {
      fillName(`  ${mockForm.name}  `);
      selectFirstAvatar();
      submitForm();

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: mockForm.name,
        avatarId: AVATARS[0].id,
      });
    });

    it('shows nothing about saving until a save fails', () => {
      expect(
        screen.queryByTestId(ACCOUNT_FORM_TEST_IDS.saveError)
      ).not.toBeInTheDocument();
    });

    it('tells the user when the save fails', async () => {
      mockOnSubmit.mockRejectedValue(new Error('nope'));

      expect(await failASave()).toHaveTextContent(ACCOUNT_FORM_COPY.saveError);
    });

    it('speaks that failure in the alert red, not as ordinary copy', async () => {
      mockOnSubmit.mockRejectedValue(new Error('nope'));

      const error = await failASave();

      expect(getComputedStyle(error).color).toBe(
        hexToRgb(getThemeTokens().colors.alertText)
      );
    });

    it('clears a previous failure when the next save succeeds', async () => {
      mockOnSubmit.mockRejectedValueOnce(new Error('nope'));

      await failASave();

      submitForm();

      await waitFor(() =>
        expect(
          screen.queryByTestId(ACCOUNT_FORM_TEST_IDS.saveError)
        ).not.toBeInTheDocument()
      );
    });

    it('calls onCancel when the cancel button is tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.cancel));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('seeded with initial values', () => {
    beforeEach(() => {
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
      const selected = selectedAvatars();

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

    it('renders no cancel button without onCancel', () => {
      expect(
        screen.queryByTestId(ACCOUNT_FORM_TEST_IDS.cancel)
      ).not.toBeInTheDocument();
    });
  });

  describe('without a title icon', () => {
    beforeEach(() => {
      render(
        <AccountForm
          data-testid={mockForm.testId}
          title={mockForm.title}
          submitLabel={mockForm.submitLabel}
          onSubmit={mockOnSubmit}
        />
      );
    });

    it('renders the title with no icon slot at all', () => {
      expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
        mockForm.title
      );
      expect(
        screen.queryByTestId(ACCOUNT_FORM_TEST_IDS.titleIcon)
      ).not.toBeInTheDocument();
    });
  });
});
