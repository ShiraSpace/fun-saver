import {
  AVATAR_PICKER_STYLE,
  AVATAR_PICKER_TEST_IDS,
} from '@/components/AvatarPicker/constants';
import { Session } from './session';

const OPTION_SELECTOR = `[data-testid="${AVATAR_PICKER_TEST_IDS.option}"]`;
const SELECTED_OPTION_SELECTOR = `${OPTION_SELECTOR}[data-selected="true"]`;

export class AvatarPickerDriver {
  constructor(private readonly session: Session) {}

  selectFirst(): Promise<void> {
    return this.session.clickSelector(OPTION_SELECTOR);
  }

  async selectedOption(): Promise<{ borderColor: string; boxShadow: string }> {
    const [borderColor, boxShadow] = await Promise.all([
      this.session.styleOf(SELECTED_OPTION_SELECTOR, 'border-top-color'),
      this.session.styleOf(SELECTED_OPTION_SELECTOR, 'box-shadow'),
    ]);
    return { borderColor, boxShadow };
  }

  hoverFirst(): Promise<void> {
    return this.session.hoverSelector(OPTION_SELECTOR);
  }

  waitForOptionToLift(): Promise<void> {
    return this.session.waitForStyle(
      OPTION_SELECTOR,
      'transform',
      `matrix(1, 0, 0, 1, 0, -${AVATAR_PICKER_STYLE.hoverLift})`
    );
  }

  async containerWidth(): Promise<number> {
    const width = await this.session.computedStyle(
      AVATAR_PICKER_TEST_IDS.container,
      'width'
    );
    return parseFloat(width);
  }

  async columnCount(): Promise<number> {
    const tracks = await this.session.computedStyle(
      AVATAR_PICKER_TEST_IDS.container,
      'grid-template-columns'
    );
    return tracks.trim().split(/\s+/).length;
  }

  async firstOption(): Promise<{
    background: string;
    borderRadius: string;
    width: number;
    height: number;
  }> {
    const [background, borderRadius, width, height] = await Promise.all([
      this.session.computedStyle(
        AVATAR_PICKER_TEST_IDS.option,
        'background-color'
      ),
      this.session.computedStyle(
        AVATAR_PICKER_TEST_IDS.option,
        'border-top-left-radius'
      ),
      this.session.computedStyle(AVATAR_PICKER_TEST_IDS.option, 'width'),
      this.session.computedStyle(AVATAR_PICKER_TEST_IDS.option, 'height'),
    ]);
    return {
      background,
      borderRadius,
      width: parseFloat(width),
      height: parseFloat(height),
    };
  }
}
