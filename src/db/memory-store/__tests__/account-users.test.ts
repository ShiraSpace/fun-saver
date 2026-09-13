import { InMemoryStore } from '../index';
import {
  mockAccount,
  mockAccountUser,
  mockSecondAccount,
  mockUser,
} from '@/test-utils/fixtures';

const mockOwner = { userId: mockUser.id, addedAt: mockAccountUser.addedAt };
const mockOtherUserId = 'u2';

describe('InMemoryStore account users', () => {
  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertAccountWithOwner(mockAccount, mockOwner);
  });

  it('writes the account', async () => {
    expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
  });

  it('writes an owner row for the account', async () => {
    expect(await store.getAccountUser(mockAccount.id, mockUser.id)).toEqual(
      mockAccountUser
    );
  });

  it('lists the account for its owner', async () => {
    expect(await store.listAccountsForUser(mockUser.id)).toEqual([mockAccount]);
  });

  it('does not list the account for anyone else', async () => {
    expect(await store.listAccountsForUser(mockOtherUserId)).toEqual([]);
  });

  it('keeps accounts owned by different users apart', async () => {
    await store.insertAccountWithOwner(mockSecondAccount, {
      userId: mockOtherUserId,
      addedAt: mockAccountUser.addedAt,
    });

    expect(await store.listAccountsForUser(mockUser.id)).toEqual([mockAccount]);
  });
});
