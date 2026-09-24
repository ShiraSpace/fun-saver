import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { Checklist } from './Checklist';
import { CHECKLIST_COPY, CHECKLIST_TEST_IDS } from './constants';

describe('the checklist of what the parent has to do', () => {
  const { decide } = METHOD_COPY.setup;

  beforeEach(() => {
    render(<Checklist {...decide} />);
  });

  it('puts every decision the method asks for in front of the parent, so none is quietly skipped', () => {
    expect(screen.getAllByTestId(CHECKLIST_TEST_IDS.item)).toHaveLength(
      decide.items.length
    );
  });

  it('says which decisions are already settled, rather than leaving that to the ticks alone', () => {
    const settled = decide.items.filter((item) => item.done);

    expect(screen.getAllByLabelText(CHECKLIST_COPY.done)).toHaveLength(
      settled.length
    );
  });

  it('says which are still open, so the parent can see what is left of them', () => {
    const settled = decide.items.filter((item) => item.done);

    expect(screen.getAllByLabelText(CHECKLIST_COPY.notDone)).toHaveLength(
      decide.items.length - settled.length
    );
  });
});
