import { fireEvent, render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { ModeToggle } from './ModeToggle';
import type { ThemeId } from '@/theme/registry';
import type { TransactionMode } from '../constants';
import { MODE_TOGGLE_COPY, MODE_TOGGLE_TEST_IDS } from './constants';

const onChange = jest.fn();

function renderToggle(mode: TransactionMode, themeId?: ThemeId): void {
  render(<ModeToggle mode={mode} onChange={onChange} />, { themeId });
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

  describe('the arrows, which sit on the track and not on the surface', () => {
    const { alertText, gainText } = getThemeTokens(THEME_ID.jungleQuest).colors;

    beforeEach(() => {
      renderToggle('deposit', THEME_ID.jungleQuest);
    });

    it('paints the withdraw arrow in the alert red', () => {
      const arrow = screen.getByText(MODE_TOGGLE_COPY.withdrawArrow);

      expect(getComputedStyle(arrow).color).toBe(hexToRgb(alertText));
    });

    it('paints the deposit arrow in the gain green', () => {
      const arrow = screen.getByText(MODE_TOGGLE_COPY.depositArrow);

      expect(getComputedStyle(arrow).color).toBe(hexToRgb(gainText));
    });
  });
});
