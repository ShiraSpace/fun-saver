import { fireEvent, render, screen } from '@/test-utils/render';
import { QueryField } from './QueryField';
import { QUERY_FIELD_TEST_IDS } from './constants';

describe('QueryField', () => {
  const mockQuery = 'אופניים';
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    render(<QueryField query={mockQuery} onChange={mockOnChange} />);
  });

  it('shows the query', () => {
    expect(screen.getByTestId(QUERY_FIELD_TEST_IDS.input)).toHaveValue(
      mockQuery
    );
  });

  describe('after typing', () => {
    const mockTypedQuery = 'כלב';

    beforeEach(() => {
      fireEvent.change(screen.getByTestId(QUERY_FIELD_TEST_IDS.input), {
        target: { value: mockTypedQuery },
      });
    });

    it('reports the typed query', () => {
      expect(mockOnChange).toHaveBeenCalledWith(mockTypedQuery);
    });
  });
});
