import { render, screen } from '@/test-utils/render';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY } from '../copy';
import { ACTION_LIST_TEST_IDS } from '../ActionList/constants';
import { GOAL_OUTCOME_TEST_IDS } from '../GoalOutcome/constants';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { PromiseSection } from './PromiseSection';

describe('the section on the promise the parent has to keep', () => {
  beforeEach(() => {
    render(<PromiseSection />);
  });

  it('flags itself as the one that matters most, all a skimming parent sees while it is shut', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.hint(SECTION_NUMBER.promise))
    ).toHaveTextContent(METHOD_COPY.promise.hint);
  });

  it('spells out both halves of the promise, since half a promise is not one', () => {
    expect(screen.getAllByTestId(GOAL_OUTCOME_TEST_IDS.outcome)).toHaveLength(
      Object.keys(METHOD_COPY.promise.rule).length
    );
  });

  it('closes on the one decision it needs — which day the money arrives', () => {
    expect(screen.getByTestId(ACTION_LIST_TEST_IDS.group)).toBeInTheDocument();
  });
});
