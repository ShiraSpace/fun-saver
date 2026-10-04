import { indexPictureWords, matchingPictures } from '../picture-search';

describe('picture search', () => {
  describe('over a small word list', () => {
    const mockPictureWords = {
      '🚲': ['אופניים'],
      '🐶': ['כלב'],
      '❤️': ['לב'],
      '✋': ['יד'],
      '🧑‍🎓': ['תלמידה'],
    };
    const mockPicturesByTerm = indexPictureWords(mockPictureWords);

    it('finds the picture for a word typed with a prefix letter', () => {
      expect(matchingPictures('האופניים', mockPicturesByTerm)).toEqual(['🚲']);
    });

    it('ranks the word as typed above the word with its prefix letter stripped, so כלב comes before לב', () => {
      expect(matchingPictures('כלב', mockPicturesByTerm)).toEqual(['🐶', '❤️']);
    });

    it('never matches a short word inside a longer one', () => {
      expect(matchingPictures('יד', mockPicturesByTerm)).toEqual(['✋']);
    });

    it('finds the picture for a word typed with two prefix letters', () => {
      expect(matchingPictures('ולאופניים', mockPicturesByTerm)).toEqual(['🚲']);
    });

    it('never finds a plural from its singular', () => {
      expect(matchingPictures('כלבים', mockPicturesByTerm)).toEqual([]);
    });

    it.each(['', '   '])(
      'finds nothing for the empty or blank search %j',
      (typed) => {
        expect(matchingPictures(typed, mockPicturesByTerm)).toEqual([]);
      }
    );
  });

  it('ranks the picture whose annotation is the whole typed phrase above one holding its words apart', () => {
    const mockPicturesByPhrase = indexPictureWords({
      '🗓️': ['יום', 'הולדת'],
      '🎂': ['יום הולדת'],
    });

    expect(matchingPictures('יום הולדת', mockPicturesByPhrase)).toEqual([
      '🎂',
      '🗓️',
    ]);
  });

  it('ranks pictures by how many typed words they match', () => {
    const mockPicturesByWordCount = indexPictureWords({
      '🐕': ['כלב'],
      '🦮': ['כלב', 'נחייה'],
    });

    expect(matchingPictures('כלב נחייה', mockPicturesByWordCount)).toEqual([
      '🦮',
      '🐕',
    ]);
  });

  it('keeps the word-list order for pictures that match equally', () => {
    const mockPicturesByEqualMatch = indexPictureWords({
      '🦴': ['כלב'],
      '🐶': ['כלב'],
    });

    expect(matchingPictures('כלב', mockPicturesByEqualMatch)).toEqual([
      '🦴',
      '🐶',
    ]);
  });

  describe('ignoring niqqud', () => {
    const mockPicturesByVowelledWord = indexPictureWords({
      '🎈': ['בָּלוֹן'],
      '🐶': ['כלב'],
    });

    it.each([
      ['on the annotation', 'בלון', '🎈'],
      ['on the typed word', 'כֶּלֶב', '🐶'],
    ])('ignores niqqud %s', (_, typed, picture) => {
      expect(matchingPictures(typed, mockPicturesByVowelledWord)).toEqual([
        picture,
      ]);
    });
  });

  it.each(["ג'ויסטיק", 'ג’ויסטיק'])(
    'finds a geresh word typed as %s',
    (typed) => {
      const mockPicturesByGereshWord = indexPictureWords({
        '🕹️': ['ג׳ויסטיק'],
      });

      expect(matchingPictures(typed, mockPicturesByGereshWord)).toEqual(['🕹️']);
    }
  );

  it.each(['מד"א', 'מד”א'])('finds an acronym typed as %s', (typed) => {
    const mockPicturesByAcronym = indexPictureWords({ '🚑': ['מד״א'] });

    expect(matchingPictures(typed, mockPicturesByAcronym)).toEqual(['🚑']);
  });

  it('ignores a comma after an annotation word', () => {
    const mockPicturesByListedWords = indexPictureWords({
      '🤟': ['בוהן, אצבע וזרת מורמות'],
    });

    expect(matchingPictures('בוהן', mockPicturesByListedWords)).toEqual(['🤟']);
  });

  it('ignores a quote mark before an annotation word', () => {
    const mockPicturesByQuotedWords = indexPictureWords({
      '🙅': ['אישה מסמנת ״לא בסדר״'],
    });

    expect(matchingPictures('לא', mockPicturesByQuotedWords)).toEqual(['🙅']);
  });

  it('drops a word that is only punctuation from the index', () => {
    expect(indexPictureWords({ '❗': ['קריאה !'] })).toEqual(
      new Map([['קריאה', new Set(['❗'])]])
    );
  });

  it('indexes nothing for an annotation that is only punctuation', () => {
    expect(indexPictureWords({ '❗': ['!'] })).toEqual(new Map());
  });

  it.each(['דו-גלגלי', 'דו־גלגלי', 'דו גלגלי'])(
    'searches a hyphen, a maqaf and a space alike: %s',
    (typed) => {
      const mockPicturesByJoinedWord = indexPictureWords({
        '🛵': ['דו־גלגלי'],
      });

      expect(matchingPictures(typed, mockPicturesByJoinedWord)).toEqual(['🛵']);
    }
  );

  describe('a prefix letter on a short word', () => {
    const mockPicturesByShortWord = indexPictureWords({
      '🔤': ['ד'],
      '✋': ['יד'],
    });

    it('is never stripped when fewer than two letters would remain', () => {
      expect(matchingPictures('בד', mockPicturesByShortWord)).toEqual([]);
    });

    it('is stripped when two letters remain', () => {
      expect(matchingPictures('ביד', mockPicturesByShortWord)).toEqual(['✋']);
    });
  });

  it('ranks an exact match on any typed word above a match with its prefix letter stripped', () => {
    const mockPicturesBySeaAndBlue = indexPictureWords({
      '⌛': ['חול'],
      '💙': ['כחול'],
      '🌊': ['ים'],
    });

    expect(matchingPictures('ים כחול', mockPicturesBySeaAndBlue)).toEqual([
      '🌊',
      '💙',
      '⌛',
    ]);
  });

  it('finds the picture for the bare word after the one holding the word with a prefix letter', () => {
    const mockPicturesByPrefixedWord = indexPictureWords({
      '🚲': ['אופניים'],
      '🚳': ['אין כניסה לאופניים'],
    });

    expect(matchingPictures('ולאופניים', mockPicturesByPrefixedWord)).toEqual([
      '🚳',
      '🚲',
    ]);
  });

  it('indexes every word of an annotation and the whole annotation', () => {
    expect(indexPictureWords({ '🎂': ['עוגת יום הולדת'] })).toEqual(
      new Map([
        ['עוגת יום הולדת', new Set(['🎂'])],
        ['עוגת', new Set(['🎂'])],
        ['יום', new Set(['🎂'])],
        ['הולדת', new Set(['🎂'])],
      ])
    );
  });
});
