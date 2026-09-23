import { tabColumns } from './tab-columns';
import { TABS_PER_ROW } from './constants';

describe('tabColumns', () => {
  it('keeps every screen on one row while they fit', () => {
    expect(tabColumns(3)).toBe(3);
    expect(tabColumns(TABS_PER_ROW)).toBe(TABS_PER_ROW);
  });

  it('balances the rows rather than leaving an orphan', () => {
    expect(tabColumns(5)).toBe(3);
    expect(tabColumns(6)).toBe(3);
  });

  it('never puts more than a row can hold', () => {
    expect(tabColumns(9)).toBeLessThanOrEqual(TABS_PER_ROW);
  });
});
