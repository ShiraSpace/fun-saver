import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { NAME_FIELD_TEST_IDS } from '@/components/CreateAccount/NameField/constants';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { Session } from './session';

export class CreateAccountDriver {
  constructor(private readonly session: Session) {}

  async isOpen(): Promise<boolean> {
    await this.session.box(NAME_FIELD_TEST_IDS.input);
    return true;
  }

  fillName(value: string): Promise<void> {
    return this.session.type(NAME_FIELD_TEST_IDS.input, value);
  }

  submit(): Promise<void> {
    return this.session.click(CREATE_ACCOUNT_TEST_IDS.submit);
  }

  cancel(): Promise<void> {
    return this.session.click(CREATE_ACCOUNT_TEST_IDS.cancel);
  }

  background(): Promise<string> {
    return this.session.computedStyle(
      CREATE_ACCOUNT_TEST_IDS.container,
      'background-image'
    );
  }

  contentAlignment(): Promise<string> {
    return this.session.computedStyle(
      CREATE_ACCOUNT_TEST_IDS.container,
      'justify-content'
    );
  }

  async formGaps(): Promise<number[]> {
    const [title, field, picker, submit] = await Promise.all([
      this.session.box(CREATE_ACCOUNT_TEST_IDS.title),
      this.session.box(NAME_FIELD_TEST_IDS.field),
      this.session.box(AVATAR_PICKER_TEST_IDS.container),
      this.session.box(CREATE_ACCOUNT_TEST_IDS.submit),
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
      this.session.box(CREATE_ACCOUNT_TEST_IDS.title),
      this.session.box(NAME_FIELD_TEST_IDS.field),
    ]);
    return {
      fromTop: title.y,
      toNameField: field.y - (title.y + title.height),
    };
  }

  titleColor(): Promise<string> {
    return this.session.computedStyle(CREATE_ACCOUNT_TEST_IDS.title, 'color');
  }

  titleFontSize(): Promise<string> {
    return this.session.computedStyle(
      CREATE_ACCOUNT_TEST_IDS.title,
      'font-size'
    );
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
