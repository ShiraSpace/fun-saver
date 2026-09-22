import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { SourceMarker } from './SourceMarker';
import { SOURCE_MARKER_TEST_IDS } from './constants';

const { list } = METHOD_COPY.sources;

describe('the number that points a claim at its source', () => {
  describe('given one source', () => {
    beforeEach(() => {
      render(<SourceMarker sources={[list[2].id]} />);
    });

    it('shows the number the parent will find beside that study in the list', () => {
      expect(
        screen.getByTestId(SOURCE_MARKER_TEST_IDS.marker)
      ).toHaveTextContent('3');
    });

    it('reads left to right, so a Hebrew sentence does not reverse it', () => {
      expect(screen.getByTestId(SOURCE_MARKER_TEST_IDS.marker)).toHaveAttribute(
        'dir',
        'ltr'
      );
    });
  });

  describe('given the several sources one claim can rest on', () => {
    beforeEach(() => {
      render(<SourceMarker sources={[list[0].id, list[1].id]} />);
    });

    it('gathers them into one, rather than trailing the sentence with several', () => {
      expect(
        screen.getByTestId(SOURCE_MARKER_TEST_IDS.marker)
      ).toHaveTextContent('1,2');
    });
  });
});
