import { screen } from '@/test-utils/render';

export function layerOf(testId: string): number {
  return Number(getComputedStyle(screen.getByTestId(testId)).zIndex);
}
