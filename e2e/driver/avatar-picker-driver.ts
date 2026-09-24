import {
  AVATAR_PICKER_STYLE,
  AVATAR_PICKER_TEST_IDS,
} from '@/components/AvatarPicker/constants';
import { AppBrowser } from './app-browser';

const OPTION_SELECTOR = `[data-testid="${AVATAR_PICKER_TEST_IDS.option}"]`;
const SELECTED_OPTION_SELECTOR = `${OPTION_SELECTOR}[data-selected="true"]`;

export class AvatarPickerDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  selectFirst(): Promise<void> {
    return this.appBrowser.clickSelector(OPTION_SELECTOR);
  }

  select(avatarId: string): Promise<void> {
    return this.appBrowser.clickSelector(
      `${OPTION_SELECTOR}:has(img[alt="${avatarId}"])`
    );
  }

  async selectedAvatar(): Promise<{ borderColor: string; boxShadow: string }> {
    const [borderColor, boxShadow] = await Promise.all([
      this.appBrowser.styleOf(SELECTED_OPTION_SELECTOR, 'border-top-color'),
      this.appBrowser.styleOf(SELECTED_OPTION_SELECTOR, 'box-shadow'),
    ]);
    return { borderColor, boxShadow };
  }

  hoverFirst(): Promise<void> {
    return this.appBrowser.hoverSelector(OPTION_SELECTOR);
  }

  waitForAvatarToLift(): Promise<void> {
    return this.appBrowser.waitForStyle(
      OPTION_SELECTOR,
      'transform',
      `matrix(1, 0, 0, 1, 0, -${AVATAR_PICKER_STYLE.hoverLift})`
    );
  }

  async pickerWidth(): Promise<number> {
    const width = await this.appBrowser.computedStyle(
      AVATAR_PICKER_TEST_IDS.container,
      'width'
    );
    return parseFloat(width);
  }

  async columnCount(): Promise<number> {
    const tracks = await this.appBrowser.computedStyle(
      AVATAR_PICKER_TEST_IDS.container,
      'grid-template-columns'
    );
    return tracks.trim().split(/\s+/).length;
  }

  async firstAvatar(): Promise<{
    background: string;
    borderRadius: string;
    width: number;
    height: number;
  }> {
    const [background, borderRadius, width, height] = await Promise.all([
      this.appBrowser.computedStyle(
        AVATAR_PICKER_TEST_IDS.option,
        'background-color'
      ),
      this.appBrowser.computedStyle(
        AVATAR_PICKER_TEST_IDS.option,
        'border-top-left-radius'
      ),
      this.appBrowser.computedStyle(AVATAR_PICKER_TEST_IDS.option, 'width'),
      this.appBrowser.computedStyle(AVATAR_PICKER_TEST_IDS.option, 'height'),
    ]);
    return {
      background,
      borderRadius,
      width: parseFloat(width),
      height: parseFloat(height),
    };
  }
}
