import { render, screen } from '@/test-utils/render';
import { ACTION_LIST_TEST_IDS } from '../ActionList/constants';
import { METHOD_COPY } from '../copy';
import { EVIDENCE_QUOTE_TEST_IDS } from '../EvidenceQuote/constants';
import { EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS } from '../ExampleWalletSplitTable/constants';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { ActionsSection } from './ActionsSection';
import { ACTIONS_SECTION } from './constants';

const LANDMARKS = [
  EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.table,
  EVIDENCE_QUOTE_TEST_IDS.quote,
  ACTION_LIST_TEST_IDS.group,
];

function inReadingOrder(): (string | null)[] {
  const section = screen.getByTestId(
    METHOD_SECTION_TEST_IDS.section(ACTIONS_SECTION.number)
  );
  const selector = LANDMARKS.map((id) => `[data-testid="${id}"]`).join(',');

  return Array.from(section.querySelectorAll(selector)).map((landmark) =>
    landmark.getAttribute('data-testid')
  );
}

describe('the section on what the parent has to do', () => {
  const { communicate } = METHOD_COPY.actions;

  beforeEach(() => {
    render(<ActionsSection />);
  });

  it('shows what the split comes to before asking the parent to decide anything', () => {
    expect(inReadingOrder()).toEqual([
      EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.table,
      EVIDENCE_QUOTE_TEST_IDS.quote,
      ACTION_LIST_TEST_IDS.group,
      ACTION_LIST_TEST_IDS.group,
    ]);
  });

  it('asks for the first conversation too, the one thing no setting in the app can do', () => {
    expect(
      screen.getByTestId(
        METHOD_SECTION_TEST_IDS.section(ACTIONS_SECTION.number)
      )
    ).toHaveTextContent(communicate.items[0].question);
  });
});
