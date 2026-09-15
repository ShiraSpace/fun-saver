import { InMemoryStore } from '../index';
import {
  mockAccount,
  mockAccountUser,
  mockSecondAccount,
  mockSecondUser,
  mockUser,
} from '@/test-utils/fixtures';

const mockOwner = { userId: mockUser.id, addedAt: mockAccountUser.addedAt };

describe('InMemoryStore account users', () => {
  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertUser(mockUser);
    await store.insertUser(mockSecondUser);
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
    expect(await store.listAccountsForUser(mockSecondUser.id)).toEqual([]);
  });

  it('keeps accounts owned by different users apart', async () => {
    await store.insertAccountWithOwner(mockSecondAccount, {
      userId: mockSecondUser.id,
      addedAt: mockAccountUser.addedAt,
    });

    expect(await store.listAccountsForUser(mockUser.id)).toEqual([mockAccount]);
  });
});
