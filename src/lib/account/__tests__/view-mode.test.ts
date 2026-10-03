import { APP_VIEW_MODE, isChildView, resolveAppViewMode } from '../view-mode';

describe('resolveAppViewMode', () => {
  it('keeps a stored child view', () => {
    expect(resolveAppViewMode(APP_VIEW_MODE.child)).toBe(APP_VIEW_MODE.child);
  });

  it('shows an account with no stored view the parent screen', () => {
    expect(resolveAppViewMode(undefined)).toBe(APP_VIEW_MODE.parent);
  });

  it('shows an account with an unknown stored view the parent screen', () => {
    expect(resolveAppViewMode('toddler')).toBe(APP_VIEW_MODE.parent);
  });
});

describe('isChildView', () => {
  it('is true for an account in child view', () => {
    expect(isChildView({ viewMode: APP_VIEW_MODE.child })).toBe(true);
  });

  it('is false for an account in parent view', () => {
    expect(isChildView({ viewMode: APP_VIEW_MODE.parent })).toBe(false);
  });
});
