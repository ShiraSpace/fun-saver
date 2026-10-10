import { fireEvent, render, screen } from '@/test-utils/render';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { PictureTile } from './PictureTile';
import { PICTURE_TILE_TEST_IDS } from './constants';

describe('PictureTile', () => {
  const mockEmoji = '🚲';
  const mockOnChoosePicture = jest.fn();

  describe('not chosen', () => {
    beforeEach(() => {
      mockOnChoosePicture.mockClear();
      render(
        <PictureTile
          emoji={mockEmoji}
          isChosen={false}
          onChoosePicture={mockOnChoosePicture}
        />
      );
    });

    it('shows its picture', () => {
      expect(
        screen.getByTestId(PICTURE_TILE_TEST_IDS.pictureTile)
      ).toHaveTextContent(mockEmoji);
    });

    it('is not pressed', () => {
      expect(
        screen.getByTestId(PICTURE_TILE_TEST_IDS.pictureTile)
      ).toHaveAttribute('aria-pressed', 'false');
    });

    describe('after it is tapped', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(PICTURE_TILE_TEST_IDS.pictureTile));
      });

      it('chooses its picture', () => {
        expect(mockOnChoosePicture).toHaveBeenCalledWith(
          createMockGoalPicture(mockEmoji)
        );
      });
    });
  });

  describe('chosen, on jungle-quest, where the primary colour is not the ring', () => {
    const { selectionRing } = getThemeTokens(THEME_ID.jungleQuest).colors;

    beforeEach(() => {
      render(
        <PictureTile
          emoji={mockEmoji}
          isChosen
          onChoosePicture={mockOnChoosePicture}
        />,
        { themeId: THEME_ID.jungleQuest }
      );
    });

    it('is pressed', () => {
      expect(
        screen.getByTestId(PICTURE_TILE_TEST_IDS.pictureTile)
      ).toHaveAttribute('aria-pressed', 'true');
    });

    it('rings the tile in the selection ring colour', () => {
      expect(
        getComputedStyle(screen.getByTestId(PICTURE_TILE_TEST_IDS.pictureTile))
          .outline
      ).toContain(selectionRing);
    });
  });
});
