import { withoutInterestAlreadySettled } from '../settled-interest';
import {
  createMockTransaction,
  mockDayOfInterest,
  mockDayOfInterestCopy,
} from '@/test-utils/mocks/transaction.mocks';
import { mockSiblingAccount } from '@/test-utils/mocks/account.mocks';

describe('withoutInterestAlreadySettled', () => {
  it('leaves out a day of interest that is already stored, so the day is not settled twice', () => {
    expect(
      withoutInterestAlreadySettled(
        [mockDayOfInterest],
        [mockDayOfInterestCopy]
      )
    ).toEqual([]);
  });

  it('keeps one of two copies of the same day of interest arriving together', () => {
    expect(
      withoutInterestAlreadySettled(
        [],
        [mockDayOfInterest, mockDayOfInterestCopy]
      )
    ).toEqual([mockDayOfInterest]);
  });

  it('keeps the interest of another child whose wallet has the same id', () => {
    const mockSiblingInterest = {
      ...mockDayOfInterestCopy,
      accountId: mockSiblingAccount.id,
    };

    expect(
      withoutInterestAlreadySettled([mockDayOfInterest], [mockSiblingInterest])
    ).toEqual([mockSiblingInterest]);
  });

  it('keeps a deposit made on a day whose interest is already settled', () => {
    const mockSameDayDeposit = createMockTransaction({
      id: 'same-day-deposit',
      occurredAt: mockDayOfInterest.occurredAt,
    });

    expect(
      withoutInterestAlreadySettled([mockDayOfInterest], [mockSameDayDeposit])
    ).toEqual([mockSameDayDeposit]);
  });
});
