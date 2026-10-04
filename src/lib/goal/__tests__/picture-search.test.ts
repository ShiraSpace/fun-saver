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

    it('keeps a word that matches as typed, so כלב never becomes לב', () => {
      expect(matchingPictures('כלב', mockPicturesByTerm)).toEqual(['🐶']);
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

    it('finds nothing for an empty or blank search', () => {
      expect(matchingPictures('', mockPicturesByTerm)).toEqual([]);
      expect(matchingPictures('   ', mockPicturesByTerm)).toEqual([]);
    });
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

  it('ignores niqqud on the typed word and on the annotation', () => {
    const mockPicturesByVowelledWord = indexPictureWords({
      '🎈': ['בָּלוֹן'],
      '🐶': ['כלב'],
    });

    expect(matchingPictures('בלון', mockPicturesByVowelledWord)).toEqual([
      '🎈',
    ]);
    expect(matchingPictures('כֶּלֶב', mockPicturesByVowelledWord)).toEqual([
      '🐶',
    ]);
  });

  it('finds a geresh word typed with either apostrophe', () => {
    const mockPicturesByGereshWord = indexPictureWords({ '🕹️': ['ג׳ויסטיק'] });

    expect(matchingPictures("ג'ויסטיק", mockPicturesByGereshWord)).toEqual([
      '🕹️',
    ]);
    expect(matchingPictures('ג’ויסטיק', mockPicturesByGereshWord)).toEqual([
      '🕹️',
    ]);
  });

  it('finds an acronym typed with a straight or a curly quote mark', () => {
    const mockPicturesByAcronym = indexPictureWords({ '🚑': ['מד״א'] });

    expect(matchingPictures('מד"א', mockPicturesByAcronym)).toEqual(['🚑']);
    expect(matchingPictures('מד”א', mockPicturesByAcronym)).toEqual(['🚑']);
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

  it('searches a hyphen, a maqaf and a space alike', () => {
    const mockPicturesByJoinedWord = indexPictureWords({ '🛵': ['דו־גלגלי'] });

    expect(matchingPictures('דו-גלגלי', mockPicturesByJoinedWord)).toEqual([
      '🛵',
    ]);
    expect(matchingPictures('דו־גלגלי', mockPicturesByJoinedWord)).toEqual([
      '🛵',
    ]);
    expect(matchingPictures('דו גלגלי', mockPicturesByJoinedWord)).toEqual([
      '🛵',
    ]);
  });

  it('never strips a prefix letter when fewer than two letters would remain', () => {
    const mockPicturesByShortWord = indexPictureWords({
      '🔤': ['ד'],
      '✋': ['יד'],
    });

    expect(matchingPictures('בד', mockPicturesByShortWord)).toEqual([]);
    expect(matchingPictures('ביד', mockPicturesByShortWord)).toEqual(['✋']);
  });

  it('stops stripping prefix letters at the first step that matches', () => {
    const mockPicturesByPrefixedWord = indexPictureWords({
      '🚲': ['אופניים'],
      '🚳': ['אין כניסה לאופניים'],
    });

    expect(matchingPictures('ולאופניים', mockPicturesByPrefixedWord)).toEqual([
      '🚳',
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
