import { InMemoryStore } from '../memory-store';
import { ACCOUNT } from '@/test-support/fixtures';

describe('InMemoryStore', () => {
  it('lists inserted accounts', async () => {
    const store = new InMemoryStore();

    await store.insertAccount(ACCOUNT);

    expect(await store.listAccounts()).toEqual([ACCOUNT]);
  });
});
