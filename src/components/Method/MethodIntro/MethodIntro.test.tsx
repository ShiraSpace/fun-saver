import { render, screen } from '@/test-utils/render';
import { GOAL_OUTCOME_TEST_IDS } from '../GoalOutcome/constants';
import { METHOD_COPY } from '../copy';
import { MethodIntro } from './MethodIntro';

describe('the opener', () => {
  beforeEach(() => {
    render(<MethodIntro />);
  });

  it('shows an outcome for every one the copy carries, so a fourth needs no change here', () => {
    expect(screen.getAllByTestId(GOAL_OUTCOME_TEST_IDS.outcome)).toHaveLength(
      Object.keys(METHOD_COPY.goal.outcome).length
    );
  });
});
