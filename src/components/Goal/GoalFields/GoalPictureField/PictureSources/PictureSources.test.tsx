import { fireEvent, render, screen } from '@/test-utils/render';
import { PictureSources } from './PictureSources';
import { GOAL_PICTURE_FIELD_COPY, GOAL_PICTURE_FIELD_TEST_IDS } from '../constants';

describe('PictureSources', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    render(<PictureSources onSearch={mockOnSearch} />);
  });

  it('opens the search when picture search is tapped', () => {
    fireEvent.click(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.search));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('offers uploading from the phone only as coming soon', () => {
    expect(
      screen.getByRole('button', { name: new RegExp(GOAL_PICTURE_FIELD_COPY.upload) })
    ).toBeDisabled();
  });

  it('offers pasting a link only as coming soon', () => {
    expect(
      screen.getByRole('button', { name: new RegExp(GOAL_PICTURE_FIELD_COPY.link) })
    ).toBeDisabled();
  });
});
