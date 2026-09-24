import { NAME_FIELD_TEST_IDS } from '@/components/AccountForm/NameField/constants';
import { ACCOUNT_FORM_TEST_IDS } from '@/components/AccountForm/constants';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { AppBrowser } from './app-browser';

export class AccountFormDriver {
  constructor(
    private readonly appBrowser: AppBrowser,
    private readonly containerTestId: string
  ) {}

  async isOpen(): Promise<boolean> {
    await this.appBrowser.box(this.containerTestId);
    return true;
  }

  async isClosed(): Promise<boolean> {
    const present = await this.appBrowser.exists(this.containerTestId);
    return !present;
  }

  fillName(value: string): Promise<void> {
    return this.appBrowser.type(NAME_FIELD_TEST_IDS.input, value);
  }

  nameValue(): Promise<string> {
    return this.appBrowser.value(NAME_FIELD_TEST_IDS.input);
  }

  replaceName(value: string): Promise<void> {
    return this.appBrowser.replace(NAME_FIELD_TEST_IDS.input, value);
  }

  submit(): Promise<void> {
    return this.appBrowser.click(ACCOUNT_FORM_TEST_IDS.submit);
  }

  cancel(): Promise<void> {
    return this.appBrowser.click(ACCOUNT_FORM_TEST_IDS.cancel);
  }

  background(): Promise<string> {
    return this.appBrowser.computedStyle(
      this.containerTestId,
      'background-image'
    );
  }

  contentAlignment(): Promise<string> {
    return this.appBrowser.computedStyle(
      this.containerTestId,
      'justify-content'
    );
  }

  async formGaps(): Promise<number[]> {
    const [title, field, picker, submit] = await Promise.all([
      this.appBrowser.box(ACCOUNT_FORM_TEST_IDS.title),
      this.appBrowser.box(NAME_FIELD_TEST_IDS.field),
      this.appBrowser.box(AVATAR_PICKER_TEST_IDS.container),
      this.appBrowser.box(ACCOUNT_FORM_TEST_IDS.submit),
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
      this.appBrowser.box(ACCOUNT_FORM_TEST_IDS.title),
      this.appBrowser.box(NAME_FIELD_TEST_IDS.field),
    ]);
    return {
      fromTop: title.y,
      toNameField: field.y - (title.y + title.height),
    };
  }

  titleColor(): Promise<string> {
    return this.appBrowser.computedStyle(ACCOUNT_FORM_TEST_IDS.title, 'color');
  }

  titleFontSize(): Promise<string> {
    return this.appBrowser.computedStyle(
      ACCOUNT_FORM_TEST_IDS.title,
      'font-size'
    );
  }

  nameFieldBackground(): Promise<string> {
    return this.appBrowser.computedStyle(
      NAME_FIELD_TEST_IDS.field,
      'background-color'
    );
  }

  nameLabelColor(): Promise<string> {
    return this.appBrowser.computedStyle(NAME_FIELD_TEST_IDS.label, 'color');
  }

  nameInputColor(): Promise<string> {
    return this.appBrowser.computedStyle(NAME_FIELD_TEST_IDS.input, 'color');
  }
}
