import { VIEW_MODE, resolveViewMode } from '../view-mode';

describe('resolveViewMode', () => {
  it('keeps child mode', () => {
    expect(resolveViewMode(VIEW_MODE.child)).toBe(VIEW_MODE.child);
  });

  it('falls back to parent mode when nothing is stored', () => {
    expect(resolveViewMode(undefined)).toBe(VIEW_MODE.parent);
  });

  it('falls back to parent mode for an unknown value', () => {
    expect(resolveViewMode('toddler')).toBe(VIEW_MODE.parent);
  });
});
