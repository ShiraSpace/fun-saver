import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import {
  VIEW_MODE,
  isShownToChild,
  otherAccountsShownToChild,
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

describe('otherAccountsShownToChild', () => {
  const mockCurrentAccount = createMockAccount({
    id: 'a1',
    viewMode: VIEW_MODE.child,
  });

  it('leaves out the account being viewed', () => {
    const mockSibling = createMockAccount({
      id: 'a2',
      viewMode: VIEW_MODE.child,
    });

    expect(
      otherAccountsShownToChild(
        [mockCurrentAccount, mockSibling],
        mockCurrentAccount
      )
    ).toEqual([mockSibling]);
  });

  it('leaves out an account in parent view', () => {
    const mockChildSibling = createMockAccount({
      id: 'a2',
      viewMode: VIEW_MODE.child,
    });
    const mockParentSibling = createMockAccount({
      id: 'a3',
      viewMode: VIEW_MODE.parent,
    });

    expect(
      otherAccountsShownToChild(
        [mockCurrentAccount, mockChildSibling, mockParentSibling],
        mockCurrentAccount
      )
    ).toEqual([mockChildSibling]);
  });

  it("keeps the family's order", () => {
    const mockFirstSibling = createMockAccount({
      id: 'a2',
      viewMode: VIEW_MODE.child,
    });
    const mockSecondSibling = createMockAccount({
      id: 'a3',
      viewMode: VIEW_MODE.child,
    });

    expect(
      otherAccountsShownToChild(
        [mockFirstSibling, mockCurrentAccount, mockSecondSibling],
        mockCurrentAccount
      )
    ).toEqual([mockFirstSibling, mockSecondSibling]);
  });
});
