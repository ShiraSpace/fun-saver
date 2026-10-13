import { fireEvent, renderHook } from '@testing-library/react';
import { historySettles } from '@/test-utils/history';
import { useModal } from '../use-modal';
import { ESCAPE_KEY } from '../constants';

function pressEscape(): void {
  fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
}

describe('useModal', () => {
  beforeEach(async () => {
    await historySettles();
    window.history.replaceState(null, '');
  });

  it('closes on escape', () => {
    const mockOnClose = jest.fn();
    renderHook(() => useModal(mockOnClose));

    pressEscape();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  describe('with another modal open below it', () => {
    it('leaves the one below open on escape', () => {
      const mockOnCloseBelow = jest.fn();
      renderHook(() => useModal(mockOnCloseBelow));
      renderHook(() => useModal(jest.fn()));

      pressEscape();

      expect(mockOnCloseBelow).not.toHaveBeenCalled();
    });

    it('closes the top one on escape', () => {
      const mockOnCloseOnTop = jest.fn();
      renderHook(() => useModal(jest.fn()));
      renderHook(() => useModal(mockOnCloseOnTop));

      pressEscape();

      expect(mockOnCloseOnTop).toHaveBeenCalledTimes(1);
    });
  });
});
