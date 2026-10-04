import { fireEvent, renderHook } from '@testing-library/react';
import { useEscapeKey } from '../use-escape-key';
import { ESCAPE_KEY } from '../constants';

describe('useEscapeKey', () => {
  const mockOnEscape = jest.fn();

  beforeEach(() => {
    mockOnEscape.mockClear();
  });

  describe('while listening', () => {
    let unmount: () => void;

    beforeEach(() => {
      ({ unmount } = renderHook(() =>
        useEscapeKey({ isListening: true, onEscape: mockOnEscape })
      ));
    });

    describe('when Escape is pressed', () => {
      beforeEach(() => {
        fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
      });

      it('calls onEscape', () => {
        expect(mockOnEscape).toHaveBeenCalledTimes(1);
      });
    });

    describe('when another key is pressed', () => {
      beforeEach(() => {
        fireEvent.keyDown(document.body, { key: 'Enter' });
      });

      it('ignores it', () => {
        expect(mockOnEscape).not.toHaveBeenCalled();
      });
    });

    describe('after unmounting', () => {
      beforeEach(() => {
        unmount();
        fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
      });

      it('no longer listens', () => {
        expect(mockOnEscape).not.toHaveBeenCalled();
      });
    });
  });

  describe('while not listening', () => {
    beforeEach(() => {
      renderHook(() =>
        useEscapeKey({ isListening: false, onEscape: mockOnEscape })
      );
      fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
    });

    it('ignores Escape', () => {
      expect(mockOnEscape).not.toHaveBeenCalled();
    });
  });

  describe('taking precedence over another Escape listener', () => {
    const mockOtherListener = jest.fn();

    beforeEach(() => {
      mockOtherListener.mockClear();
      document.addEventListener('keydown', mockOtherListener);
      renderHook(() =>
        useEscapeKey({
          isListening: true,
          onEscape: mockOnEscape,
          takesPrecedence: true,
        })
      );
      fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
    });

    afterEach(() => {
      document.removeEventListener('keydown', mockOtherListener);
    });

    it('keeps Escape from reaching the other listener', () => {
      expect(mockOtherListener).not.toHaveBeenCalled();
    });
  });
});
