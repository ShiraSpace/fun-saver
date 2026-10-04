import { fireEvent, render, screen } from '@/test-utils/render';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { PictureTiles } from './PictureTiles';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';

function renderStateOnly(requestState: RequestState, query: string): void {
  render(
    <PictureTiles
      pictures={[]}
      requestState={requestState}
      query={query}
      chosenEmoji="🎯"
      onChoose={jest.fn()}
    />
  );
}

describe('PictureTiles', () => {
  describe('with matching pictures and one chosen', () => {
    const mockPictures = ['🚲', '🚴', '🛴'];
    const mockChosenEmoji = '🚴';
    const mockOnChoose = jest.fn();

    beforeEach(() => {
      mockOnChoose.mockClear();
      render(
        <PictureTiles
          pictures={mockPictures}
          requestState={REQUEST_STATE.idle}
          query="אופניים"
          chosenEmoji={mockChosenEmoji}
          onChoose={mockOnChoose}
        />
      );
    });

    it('shows one tile per matching picture, in order', () => {
      const tiles = screen.getAllByTestId(PICTURE_TILES_TEST_IDS.tile);

      expect(tiles.map((tile) => tile.textContent)).toEqual(mockPictures);
    });

    it('marks only the chosen picture as pressed', () => {
      const pressed = screen
        .getAllByTestId(PICTURE_TILES_TEST_IDS.tile)
        .filter((tile) => tile.getAttribute('aria-pressed') === 'true');

      expect(pressed.map((tile) => tile.textContent)).toEqual([
        mockChosenEmoji,
      ]);
    });

    describe('after tapping a tile that is not chosen', () => {
      const mockTappedEmoji = '🛴';

      beforeEach(() => {
        fireEvent.click(screen.getByText(mockTappedEmoji));
      });

      it('chooses that tile’s picture', () => {
        expect(mockOnChoose).toHaveBeenCalledWith(mockTappedEmoji);
      });
    });
  });

  describe('while the word list loads', () => {
    beforeEach(() => {
      renderStateOnly(REQUEST_STATE.pending, 'אופניים');
    });

    it('says the pictures are being looked for', () => {
      expect(
        screen.getByTestId(PICTURE_TILES_TEST_IDS.stateLine)
      ).toHaveTextContent(PICTURE_TILES_COPY.loading);
    });
  });

  describe('when the word list failed to load', () => {
    beforeEach(() => {
      renderStateOnly(REQUEST_STATE.failed, 'אופניים');
    });

    it('says the pictures did not load', () => {
      expect(
        screen.getByTestId(PICTURE_TILES_TEST_IDS.stateLine)
      ).toHaveTextContent(PICTURE_TILES_COPY.failed);
    });
  });

  describe('with nothing typed but spaces', () => {
    beforeEach(() => {
      renderStateOnly(REQUEST_STATE.idle, '  ');
    });

    it('hints at typing what to search for', () => {
      expect(
        screen.getByTestId(PICTURE_TILES_TEST_IDS.stateLine)
      ).toHaveTextContent(PICTURE_TILES_COPY.hint);
    });
  });

  describe('with no picture matching the typed words', () => {
    const mockQuery = 'קקטוס';

    beforeEach(() => {
      renderStateOnly(REQUEST_STATE.idle, mockQuery);
    });

    it('names the typed words in the no-match line', () => {
      expect(
        screen.getByTestId(PICTURE_TILES_TEST_IDS.stateLine)
      ).toHaveTextContent(PICTURE_TILES_COPY.noMatch(mockQuery));
    });
  });

  describe('on jungle-quest, where the primary colour is not the ring', () => {
    const { selectionRing } = getThemeTokens(THEME_ID.jungleQuest).colors;

    beforeEach(() => {
      render(
        <PictureTiles
          pictures={['🚲']}
          requestState={REQUEST_STATE.idle}
          query="אופניים"
          chosenEmoji="🚲"
          onChoose={jest.fn()}
        />,
        { themeId: THEME_ID.jungleQuest }
      );
    });

    it('rings the chosen tile in the selection ring colour', () => {
      expect(
        getComputedStyle(screen.getByTestId(PICTURE_TILES_TEST_IDS.tile))
          .outline
      ).toContain(selectionRing);
    });
  });
});
