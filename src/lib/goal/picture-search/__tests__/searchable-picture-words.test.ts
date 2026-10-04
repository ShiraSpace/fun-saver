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

  it('adds the spoken name after the keywords', () => {
    const mockUnicodeEmoji = { '🛴': { emoji_version: '3.0' } };
    const mockUnicodeWords = {
      '🛴': { default: ['קורקינט'], tts: ['קורקינט ילדים'] },
    };

    expect(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords)).toEqual({
      '🛴': ['קורקינט', 'קורקינט ילדים'],
    });
  });

  it('drops a picture with no Hebrew words', () => {
    const mockUnicodeEmoji = {
      '🐶': { emoji_version: '0.6' },
      '🦴': { emoji_version: '11.0' },
    };
    const mockUnicodeWords = { '🐶': { default: ['כלב'] } };

    expect(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords)).toEqual({
      '🐶': ['כלב'],
    });
  });

  it('finds the words for ❤️ under the Unicode key that leaves out its variation selector', () => {
    const mockUnicodeEmoji = { '❤️': { emoji_version: '0.6' } };
    const mockUnicodeWords = { '❤': { default: ['לב'] } };

    expect(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords)).toEqual({
      '❤️': ['לב'],
    });
  });

  it('keeps the pictures in Unicode order', () => {
    const mockUnicodeEmoji = {
      '🚲': { emoji_version: '0.6' },
      '🐶': { emoji_version: '0.6' },
    };
    const mockUnicodeWords = {
      '🚲': { default: ['אופניים'] },
      '🐶': { default: ['כלב'] },
    };

    expect(
      Object.keys(searchablePictureWords(mockUnicodeEmoji, mockUnicodeWords))
    ).toEqual(['🚲', '🐶']);
  });
});
