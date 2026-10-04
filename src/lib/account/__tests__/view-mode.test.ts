import {
  VIEW_MODE,
  isShownToChild,
  siblingAccountsShownToChild,
  resolveViewMode,
} from '../view-mode';

describe('resolveViewMode', () => {
  it('keeps a stored child view', () => {
    expect(resolveViewMode(VIEW_MODE.child)).toBe(VIEW_MODE.child);
  });

  it('shows an account with no stored view the parent screen', () => {
    expect(resolveViewMode(undefined)).toBe(VIEW_MODE.parent);
  });

  it('shows an account with an unknown stored view the parent screen', () => {
    expect(resolveViewMode('toddler')).toBe(VIEW_MODE.parent);
  });
});

describe('isShownToChild', () => {
  it('is true for an account in child view', () => {
    expect(isShownToChild({ viewMode: VIEW_MODE.child })).toBe(true);
  });

  it('is false for an account in parent view', () => {
    expect(isShownToChild({ viewMode: VIEW_MODE.parent })).toBe(false);
  });
});

describe('siblingAccountsShownToChild', () => {
  it('leaves out an account in parent view', () => {
    const mockCurrentAccount = { id: 'a1', viewMode: VIEW_MODE.child };
    const mockChildSiblingAccount = { id: 'a2', viewMode: VIEW_MODE.child };
    const mockParentSiblingAccount = { id: 'a3', viewMode: VIEW_MODE.parent };

    expect(
      siblingAccountsShownToChild(
        [mockCurrentAccount, mockChildSiblingAccount, mockParentSiblingAccount],
        mockCurrentAccount
      )
    ).toEqual([mockChildSiblingAccount]);
  });
});
