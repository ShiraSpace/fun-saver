import { InMemoryStore } from '@/db/memory-store';
import { today } from '@/lib/clock';
import { SavingsLockedError } from '@/lib/goal/errors';
import { OverdraftError } from '../errors';
import type { Account } from '@/lib/account/types';
import { balance } from '@/lib/wallet/balance';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { walletIdNamed } from '@/test-utils/wallet-id-named';
import { addDeposit, addWithdrawal, splitDeposit } from '../transactions';

describe('addWithdrawal from savings with a goal', () => {
  const mockDepositAgorot = 2000;
  const mockSavingsBalance = splitDeposit(mockDepositAgorot).savings;

  let store: InMemoryStore;
  let account: Account;
  let savingsId: string;

  beforeEach(async () => {
    store = new InMemoryStore();
    account = await createOwnedAccount(store);
    savingsId = walletIdNamed(account, WALLET_NAMES.savings);

    await addDeposit({
      store,
      account,
      amountAgorot: mockDepositAgorot,
      asOf: today(),
    });
  });

  function withdrawFrom(
    walletId: string,
    amountAgorot: number
  ): Promise<unknown> {
    return addWithdrawal({
      store,
      account,
      walletId,
      amountAgorot,
      asOf: today(),
    });
  }

  async function walletBalance(walletId: string): Promise<number> {
    return balance(await store.listTransactionsByWallet(account.id, walletId));
  }

  describe('an overdraft while a goal is reached', () => {
    let refusal: unknown;

    beforeEach(async () => {
      await store.insertGoal(
        createMockGoal({ accountId: account.id, amount: mockSavingsBalance })
      );
      refusal = await withdrawFrom(savingsId, mockSavingsBalance + 1).catch(
        (error) => error
      );
    });

    it('refuses with OverdraftError', () => {
      expect(refusal).toBeInstanceOf(OverdraftError);
    });

    it('keeps the goal active', async () => {
      expect(await store.getActiveGoal(account.id)).toBeDefined();
    });
  });

  describe('a withdrawal within the balance', () => {
    const mockWithdrawalAgorot = 100;

    describe('savings with an active goal not yet reached', () => {
      let refusal: unknown;

      beforeEach(async () => {
        await store.insertGoal(
          createMockGoal({
            accountId: account.id,
            amount: mockSavingsBalance + 1,
          })
        );
        refusal = await withdrawFrom(savingsId, mockWithdrawalAgorot).catch(
          (error) => error
        );
      });

      it('refuses with SavingsLockedError', () => {
        expect(refusal).toBeInstanceOf(SavingsLockedError);
      });

      it('records nothing', async () => {
        expect(await walletBalance(savingsId)).toBe(mockSavingsBalance);
      });
    });

    describe('savings with a reached goal', () => {
      beforeEach(async () => {
        await store.insertGoal(
          createMockGoal({ accountId: account.id, amount: mockSavingsBalance })
        );
        await withdrawFrom(savingsId, mockWithdrawalAgorot);
      });

      it('ends the goal', async () => {
        expect(await store.getActiveGoal(account.id)).toBeUndefined();
      });
    });

    describe('spending while a goal is active', () => {
      const mockSpendingBalance = splitDeposit(mockDepositAgorot).spending;

      let spendingId: string;

      beforeEach(async () => {
        spendingId = walletIdNamed(account, WALLET_NAMES.spending);
        await store.insertGoal(
          createMockGoal({
            accountId: account.id,
            amount: mockSpendingBalance + 1,
          })
        );
        await withdrawFrom(spendingId, mockWithdrawalAgorot);
      });

      it('records the withdrawal', async () => {
        expect(await walletBalance(spendingId)).toBe(
          mockSpendingBalance - mockWithdrawalAgorot
        );
      });

      it('keeps the goal active', async () => {
        expect(await store.getActiveGoal(account.id)).toBeDefined();
      });
    });
  });
});
