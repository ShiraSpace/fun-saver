import pictureWords from '../picture-words.he.json';
import { isValidPictureEmoji } from '@/lib/goal/goal-request-validator';

describe('the Hebrew emoji word list', () => {
  it('holds only pictures a goal request accepts', () => {
    const invalidPictures = Object.keys(pictureWords).filter(
      (picture) => !isValidPictureEmoji(picture)
    );

    expect(invalidPictures).toEqual([]);
  });
});
