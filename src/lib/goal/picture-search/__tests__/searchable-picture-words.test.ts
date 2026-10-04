import { searchablePictureWords } from '../searchable-picture-words';

describe('searchable picture words', () => {
  it('keeps a picture with its Hebrew words, each word once', () => {
    const mockUnicodeEmoji = { '🚲': { emoji_version: '0.6' } };
    const mockUnicodeWords = {
      '🚲': { default: ['רכיבה', 'אופניים'], tts: ['אופניים'] },
    };

    expect(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords)).toEqual({
      '🚲': ['רכיבה', 'אופניים'],
    });
  });

  it('keeps an Emoji 13.0 picture and drops a newer one the oldest phone cannot draw', () => {
    const mockUnicodeEmoji = {
      '🥲': { emoji_version: '13.0' },
      '😮‍💨': { emoji_version: '13.1' },
    };
    const mockUnicodeWords = {
      '🥲': { default: ['דמעה'] },
      '😮‍💨': { default: ['נשיפה'] },
    };

    expect(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords)).toEqual({
      '🥲': ['דמעה'],
    });
  });

  it('drops the hair and gender variants of a picture', () => {
    const mockUnicodeEmoji = {
      '🧑‍🎓': { emoji_version: '12.1' },
      '👨‍🦰': { emoji_version: '11.0' },
      '🏃‍♀️': { emoji_version: '4.0' },
    };
    const mockUnicodeWords = {
      '🧑‍🎓': { default: ['סטודנט'] },
      '👨‍🦰': { default: ['ג׳ינג׳י'] },
      '🏃‍♀': { default: ['ריצה'] },
    };

    expect(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords)).toEqual({
      '🧑‍🎓': ['סטודנט'],
    });
  });
});
