import { fireEvent, render, screen } from '@/test-utils/render';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { PICTURE_TILE_TEST_IDS } from './PictureTile/constants';
import { PictureTiles } from './PictureTiles';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';

describe('PictureTiles', () => {
  const mockQuery = 'אופניים';

  describe('with matching pictures and one chosen', () => {
    const mockFoundEmoji = ['🚲', '🚴', '🛴'];
    const mockChosenPicture = createMockGoalPicture('🚴');
    const mockOnChoosePicture = jest.fn();

    beforeEach(() => {
      mockOnChoosePicture.mockClear();
      render(
        <PictureTiles
          foundEmoji={mockFoundEmoji}
          requestState={REQUEST_STATE.idle}
          query={mockQuery}
          chosenPicture={mockChosenPicture}
          onChoosePicture={mockOnChoosePicture}
        />
      );
    });

    it('shows one tile per matching picture, in order', () => {
      const tiles = screen.getAllByTestId(PICTURE_TILE_TEST_IDS.pictureTile);

      expect(tiles.map((tile) => tile.textContent)).toEqual(mockFoundEmoji);
    });

    it('marks only the chosen picture as pressed', () => {
      const pressed = screen
        .getAllByTestId(PICTURE_TILE_TEST_IDS.pictureTile)
        .filter((tile) => tile.getAttribute('aria-pressed') === 'true');

      expect(pressed.map((tile) => tile.textContent)).toEqual([
        mockChosenPicture.emoji,
      ]);
    });

    describe('after tapping a tile that is not chosen', () => {
      const mockTappedEmoji = '🛴';

      beforeEach(() => {
        fireEvent.click(screen.getByText(mockTappedEmoji));
      });

      it('chooses that tile’s picture', () => {
        expect(mockOnChoosePicture).toHaveBeenCalledWith(
          createMockGoalPicture(mockTappedEmoji)
        );
      });
    });
  });

  describe('with no tiles to show', () => {
    const mockOnChoosePicture = jest.fn();

    function renderStateOnly(requestState: RequestState, query: string): void {
      render(
        <PictureTiles
          foundEmoji={[]}
          requestState={requestState}
          query={query}
          chosenPicture={DEFAULT_GOAL_PICTURE}
          onChoosePicture={mockOnChoosePicture}
        />
      );
    }

    describe('while the word list loads', () => {
      beforeEach(() => {
        renderStateOnly(REQUEST_STATE.pending, mockQuery);
      });

      it('says the pictures are being looked for', () => {
        expect(
          screen.getByTestId(PICTURE_TILES_TEST_IDS.noPicturesReason)
        ).toHaveTextContent(PICTURE_TILES_COPY.loading);
      });
    });

    describe('when the word list failed to load', () => {
      beforeEach(() => {
        renderStateOnly(REQUEST_STATE.failed, mockQuery);
      });

      it('says the pictures did not load', () => {
        expect(
          screen.getByTestId(PICTURE_TILES_TEST_IDS.noPicturesReason)
        ).toHaveTextContent(PICTURE_TILES_COPY.failedToLoad);
      });
    });

    describe('with nothing typed but spaces', () => {
      const mockBlankQuery = '  ';

      beforeEach(() => {
        renderStateOnly(REQUEST_STATE.idle, mockBlankQuery);
      });

      it('hints at typing what to search for', () => {
        expect(
          screen.getByTestId(PICTURE_TILES_TEST_IDS.noPicturesReason)
        ).toHaveTextContent(PICTURE_TILES_COPY.nothingTyped);
      });
    });

    describe('with no picture matching the typed words', () => {
      const mockUnmatchedQuery = 'קקטוס';

      beforeEach(() => {
        renderStateOnly(REQUEST_STATE.idle, mockUnmatchedQuery);
      });

      it('names the typed words in the no-match line', () => {
        expect(
          screen.getByTestId(PICTURE_TILES_TEST_IDS.noPicturesReason)
        ).toHaveTextContent(PICTURE_TILES_COPY.noMatch(mockUnmatchedQuery));
      });
    });
  });
});
