import { TABS_PER_ROW } from './constants';

export function tabColumns(screenCount: number): number {
  const rows = Math.max(1, Math.ceil(screenCount / TABS_PER_ROW));

  return Math.ceil(screenCount / rows);
}
