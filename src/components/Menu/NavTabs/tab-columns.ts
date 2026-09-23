import { TABS_PER_ROW } from './constants';

export function tabColumns(screenCount: number): number {
  return Math.ceil(screenCount / Math.ceil(screenCount / TABS_PER_ROW));
}
