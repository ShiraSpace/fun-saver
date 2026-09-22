import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { GOAL_OUTCOME_TEST_IDS } from '../GoalOutcome/constants';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { PromiseSection } from './PromiseSection';
import { PROMISE_SECTION } from './constants';

describe('the section on the promise the parent has to keep', () => {
  beforeEach(() => {
    render(<PromiseSection />);
  });

  it('flags itself as the one that matters most, all a skimming parent sees while it is shut', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.hint(PROMISE_SECTION.number))
    ).toHaveTextContent(METHOD_COPY.promise.hint);
  });

  it('spells out both halves of the promise, since half a promise is not one', () => {
    expect(screen.getAllByTestId(GOAL_OUTCOME_TEST_IDS.outcome)).toHaveLength(
      Object.keys(METHOD_COPY.promise.rule).length
    );
  });
});
