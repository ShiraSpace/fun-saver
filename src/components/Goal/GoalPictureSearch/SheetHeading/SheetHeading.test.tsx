import { fireEvent, render, screen } from '@/test-utils/render';
import { SheetHeading } from './SheetHeading';
import { SHEET_HEADING_TEST_IDS } from './constants';

describe('SheetHeading', () => {
  const mockTitleId = 'mock-title-id';
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    render(<SheetHeading titleId={mockTitleId} onClose={mockOnClose} />);
  });

  it('gives the title the id the sheet is labelled by', () => {
    expect(screen.getByTestId(SHEET_HEADING_TEST_IDS.title)).toHaveAttribute(
      'id',
      mockTitleId
    );
  });

  describe('after tapping ✕', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByTestId(SHEET_HEADING_TEST_IDS.close));
    });

    it('closes', () => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
