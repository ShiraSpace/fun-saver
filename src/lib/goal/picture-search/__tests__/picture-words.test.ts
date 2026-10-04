import pictureWords from '../picture-words.he.json';
import { invalidGoalPictures } from '../searchable-picture-words';

describe('the Hebrew emoji word list', () => {
  it('holds only pictures a goal request accepts', () => {
    expect(invalidGoalPictures(pictureWords)).toEqual([]);
  });
});
