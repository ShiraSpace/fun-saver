import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { SourceList } from './SourceList';
import { SOURCE_LIST_TEST_IDS } from './constants';

const { sources } = METHOD_COPY;

describe('the studies behind the page', () => {
  beforeEach(() => {
    render(<SourceList sources={sources.list} />);
  });

  it('keeps them in the order their numbers come from, so a number in the text finds the study it points at', () => {
    const listed = screen
      .getAllByTestId(SOURCE_LIST_TEST_IDS.citation)
      .map((citation) => citation.getAttribute('href'));

    expect(listed).toEqual(sources.list.map((source) => source.url));
  });

  it('opens each one away from the page, so a parent who goes to check a study does not lose their place', () => {
    const opened = screen
      .getAllByTestId(SOURCE_LIST_TEST_IDS.citation)
      .map((citation) => citation.getAttribute('target'));

    expect(opened).toEqual(sources.list.map(() => '_blank'));
  });
});
