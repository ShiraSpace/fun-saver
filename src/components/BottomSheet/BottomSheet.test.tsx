import { render, screen } from '@/test-utils/render';
import { getThemeTokens } from '@/theme/registry';
import { BottomSheet, BottomSheetScrim } from './BottomSheet.styles';

describe('BottomSheet', () => {
  const mockSheetTestId = 'mock-bottom-sheet';
  const mockScrimTestId = 'mock-bottom-sheet-scrim';

  beforeEach(() => {
    render(
      <>
        <BottomSheetScrim data-testid={mockScrimTestId} />
        <BottomSheet data-testid={mockSheetTestId} />
      </>
    );
  });

  it('dims what it covers', () => {
    expect(
      getComputedStyle(screen.getByTestId(mockScrimTestId)).background
    ).toContain(getThemeTokens().tints.shade);
  });

  it('rests on the bottom edge of the screen', () => {
    expect(getComputedStyle(screen.getByTestId(mockSheetTestId)).bottom).toBe(
      '0px'
    );
  });
});
