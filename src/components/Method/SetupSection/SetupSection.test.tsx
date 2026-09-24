import { render, screen } from '@/test-utils/render';
import { CHECKLIST_TEST_IDS } from '../Checklist/constants';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY } from '../copy';
import { EVIDENCE_QUOTE_TEST_IDS } from '../EvidenceQuote/constants';
import { EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS } from '../ExampleWalletSplitTable/constants';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { SetupSection } from './SetupSection';

const mockLandmarks = [
  EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.table,
  EVIDENCE_QUOTE_TEST_IDS.quote,
  CHECKLIST_TEST_IDS.group,
];

function inReadingOrder(): (string | null)[] {
  const section = screen.getByTestId(
    METHOD_SECTION_TEST_IDS.section(SECTION_NUMBER.setup)
  );
  const selector = mockLandmarks.map((id) => `[data-testid="${id}"]`).join(',');

  return Array.from(section.querySelectorAll(selector)).map((landmark) =>
    landmark.getAttribute('data-testid')
  );
}

describe('the section on what the parent has to do', () => {
  const { communicate } = METHOD_COPY.setup;

  beforeEach(() => {
    render(<SetupSection />);
  });

  it('shows what the split comes to before asking the parent to decide anything', () => {
    expect(inReadingOrder()).toEqual([
      EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.table,
      EVIDENCE_QUOTE_TEST_IDS.quote,
      CHECKLIST_TEST_IDS.group,
      CHECKLIST_TEST_IDS.group,
    ]);
  });

  it('asks for the first conversation too, the one thing no setting in the app can do', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.section(SECTION_NUMBER.setup))
    ).toHaveTextContent(communicate.items[0].question);
  });
});
