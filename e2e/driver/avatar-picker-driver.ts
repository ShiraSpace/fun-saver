import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import { Session } from './session';

export class AvatarPickerDriver {
  constructor(private readonly session: Session) {}

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
