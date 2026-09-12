import { fireEvent, screen } from '@/test-utils/render';
import { ACCOUNT_FORM_TEST_IDS } from '@/components/AccountForm/constants';
import { NAME_FIELD_TEST_IDS } from '@/components/AccountForm/NameField/constants';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';

export function typeName(name: string): void {
  fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
    target: { value: name },
  });
}

export function nameInput(): HTMLElement {
  return screen.getByTestId(NAME_FIELD_TEST_IDS.input);
}

export function pickFirstAvatar(): void {
  fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
}

export function pickAvatar(avatarId: string): void {
  const option = screen
    .getAllByTestId(AVATAR_PICKER_TEST_IDS.option)
    .find((candidate) => candidate.querySelector(`img[alt="${avatarId}"]`));

  if (!option) {
    throw new Error(`no avatar option for ${avatarId}`);
  }

  fireEvent.click(option);
}

export function chosenAvatars(): HTMLElement[] {
  return screen
    .getAllByTestId(AVATAR_PICKER_TEST_IDS.option)
    .filter((option) => option.dataset.selected === 'true');
}

export function submitForm(): void {
  fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.submit));
}

export function cancelForm(): void {
  fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.cancel));
}
