import { render, screen } from '@/test-utils/render';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { SOURCES_SECTION_ID } from '../constants';
import { METHOD_COPY } from '../copy';
import { SourcesSection } from './SourcesSection';

const { sources } = METHOD_COPY;

describe('the sources a parent can go and check', () => {
  beforeEach(() => {
    render(<SourcesSection />);
  });

  it('is not numbered, because reading the sources is not one of the six steps', () => {
    expect(
      screen.queryByTestId(METHOD_SECTION_TEST_IDS.numeral(SOURCES_SECTION_ID))
    ).not.toBeInTheDocument();
  });

  it('says how many there are before it is opened, so the parent knows what they are opening', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.hint(SOURCES_SECTION_ID))
    ).toHaveTextContent(String(sources.list.length));
  });

  it('sets the studies between the line that introduces them and the note that points further', () => {
    const body = screen.getByTestId(
      METHOD_SECTION_TEST_IDS.body(SOURCES_SECTION_ID)
    );
    const shape = Array.from(body.children).map((child) => child.tagName);

    expect(shape).toEqual(['P', 'OL', 'P']);
  });
});
