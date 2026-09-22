import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { ActionList } from './ActionList';
import { ACTION_LIST_COPY, ACTION_LIST_TEST_IDS } from './constants';

describe('the checklist of what the parent has to do', () => {
  const { decide } = METHOD_COPY.actions;

  beforeEach(() => {
    render(<ActionList {...decide} />);
  });

  it('puts every decision the method asks for in front of the parent, so none is quietly skipped', () => {
    expect(screen.getAllByTestId(ACTION_LIST_TEST_IDS.item)).toHaveLength(
      decide.items.length
    );
  });

  it('says which decisions are already settled, rather than leaving that to the ticks alone', () => {
    const settled = decide.items.filter((item) => item.done);

    expect(screen.getAllByLabelText(ACTION_LIST_COPY.settled)).toHaveLength(
      settled.length
    );
  });
});
