import { NAME_FIELD_TEST_IDS } from '@/components/AccountForm/NameField/constants';
import { ACCOUNT_FORM_TEST_IDS } from '@/components/AccountForm/constants';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { Session } from './session';

export class AccountFormDriver {
  constructor(
    private readonly session: Session,
    private readonly containerTestId: string
  ) {}

  async isOpen(): Promise<boolean> {
    await this.session.box(this.containerTestId);
    return true;
  }

  fillName(value: string): Promise<void> {
    return this.session.type(NAME_FIELD_TEST_IDS.input, value);
  }

  submit(): Promise<void> {
    return this.session.click(ACCOUNT_FORM_TEST_IDS.submit);
  }

  cancel(): Promise<void> {
    return this.session.click(ACCOUNT_FORM_TEST_IDS.cancel);
  }

  background(): Promise<string> {
    return this.session.computedStyle(this.containerTestId, 'background-image');
  }

  contentAlignment(): Promise<string> {
    return this.session.computedStyle(this.containerTestId, 'justify-content');
  }

  async formGaps(): Promise<number[]> {
    const [title, field, picker, submit] = await Promise.all([
      this.session.box(ACCOUNT_FORM_TEST_IDS.title),
      this.session.box(NAME_FIELD_TEST_IDS.field),
      this.session.box(AVATAR_PICKER_TEST_IDS.container),
      this.session.box(ACCOUNT_FORM_TEST_IDS.submit),
    ]);
    return [
      title.y,
      field.y - (title.y + title.height),
      picker.y - (field.y + field.height),
      submit.y - (picker.y + picker.height),
    ];
  }

  async titleSpacing(): Promise<{ fromTop: number; toNameField: number }> {
    const [title, field] = await Promise.all([
      this.session.box(ACCOUNT_FORM_TEST_IDS.title),
      this.session.box(NAME_FIELD_TEST_IDS.field),
    ]);
    return {
      fromTop: title.y,
      toNameField: field.y - (title.y + title.height),
    };
  }

  titleColor(): Promise<string> {
    return this.session.computedStyle(ACCOUNT_FORM_TEST_IDS.title, 'color');
  }

  titleFontSize(): Promise<string> {
    return this.session.computedStyle(ACCOUNT_FORM_TEST_IDS.title, 'font-size');
  }

  nameFieldBackground(): Promise<string> {
    return this.session.computedStyle(
      NAME_FIELD_TEST_IDS.field,
      'background-color'
    );
  }

  nameLabelColor(): Promise<string> {
    return this.session.computedStyle(NAME_FIELD_TEST_IDS.label, 'color');
  }

  nameInputColor(): Promise<string> {
    return this.session.computedStyle(NAME_FIELD_TEST_IDS.input, 'color');
  }
}
