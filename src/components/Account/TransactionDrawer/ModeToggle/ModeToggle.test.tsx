import { fireEvent, render, screen } from '@/test-support/render';
import { ModeToggle } from './ModeToggle';
import type { TransactionMode } from '../constants';
import { MODE_TOGGLE_TEST_IDS } from './constants';

const onChange = jest.fn();

function renderToggle(mode: TransactionMode): void {
  render(<ModeToggle mode={mode} onChange={onChange} />);
}

describe('ModeToggle', () => {
  beforeEach(() => {
    onChange.mockClear();
  });

  it('marks the active mode as pressed', () => {
    renderToggle('withdraw');

    expect(screen.getByTestId(MODE_TOGGLE_TEST_IDS.withdraw)).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByTestId(MODE_TOGGLE_TEST_IDS.deposit)).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('reports the tapped mode through onChange', () => {
    renderToggle('deposit');

    fireEvent.click(screen.getByTestId(MODE_TOGGLE_TEST_IDS.withdraw));

    expect(onChange).toHaveBeenCalledWith('withdraw');
  });
});
