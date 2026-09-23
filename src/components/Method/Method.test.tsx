import { renderWithUserAt, screen, within } from '@/test-utils/render';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { METHOD_SECTION_TEST_IDS } from './MethodSection/constants';
import { METHOD_INTRO_TEST_IDS } from './MethodIntro/constants';
import { SOURCE_LIST_TEST_IDS } from './SourceList/constants';
import { SOURCE_MARKER_TEST_IDS } from './SourceMarker/constants';
import { METHOD_ROUTE, SECTION_NUMBER, SOURCES_SECTION_ID } from './constants';
import { Method } from './Method';
import { METHOD_COPY } from './copy';

const SECTION_NUMBERS = Object.values(SECTION_NUMBER);

function renderedSectionIds(): (string | undefined)[] {
  return screen
    .getAllByTestId(/^method-section-\d+$/)
    .map((section) => section.dataset.testid);
}

describe('the method page', () => {
  beforeEach(() => {
    renderWithUserAt(
      METHOD_ROUTE,
      <Method
        accounts={[mockDerivedAccount, mockSecondDerivedAccount]}
        initialAccount={mockDerivedAccount}
      />
    );
  });

  it('names itself in the header, so the parent knows what they opened', () => {
    expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
      METHOD_COPY.title
    );
  });

  it('names the child it is showing, the avatar being the way back to them', () => {
    const homeLink = screen.getByTestId(HEADER_TEST_IDS.homeLink);

    expect(homeLink).toContainElement(
      screen.getByTestId(HEADER_TEST_IDS.avatar)
    );
    expect(homeLink).toHaveAccessibleName(
      expect.stringContaining(mockDerivedAccount.name)
    );
  });

  it('opens with the method itself, the one block that never collapses', () => {
    expect(screen.getByTestId(METHOD_INTRO_TEST_IDS.intro)).toBeInTheDocument();
  });

  it('follows the opener with the first section, closed like the rest', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.section(SECTION_NUMBER.why))
    ).toBeInTheDocument();
  });

  it('lists them in the order the copy numbers them', () => {
    expect(renderedSectionIds()).toEqual(
      SECTION_NUMBERS.map(METHOD_SECTION_TEST_IDS.section)
    );
  });

  it('closes with the sources, after every section whose numbers they carry', () => {
    const sources = screen.getByTestId(
      METHOD_SECTION_TEST_IDS.section(SOURCES_SECTION_ID)
    );

    expect(sources.parentElement?.lastElementChild).toBe(sources);
  });

  it('lands a claim on the study it names, counting the list the same way the reader does', () => {
    const [cited] = METHOD_COPY.why.evidence.sources;
    const study = METHOD_COPY.sources.list.find(
      (source) => source.id === cited
    );

    const [marker] = within(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.body(SECTION_NUMBER.why))
    ).getAllByTestId(SOURCE_MARKER_TEST_IDS.marker);
    const entries = screen.getAllByTestId(SOURCE_LIST_TEST_IDS.entry);
    const pointedAt = entries[Number(marker.textContent) - 1];

    expect(
      within(pointedAt).getByTestId(SOURCE_LIST_TEST_IDS.citation)
    ).toHaveAttribute('href', study?.url);
  });
});
