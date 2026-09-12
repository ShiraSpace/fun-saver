import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '../index';
import { JsonFileStore } from '../json-file-store';
import { PostgresStore } from '../postgres-store';
import { mockAccount } from '@/test-utils/fixtures';
import { mutableEnv, withCleanEnv } from '@/test-utils/test-utils';

const POSTGRES_URL = 'postgres://user:pass@example.neon.tech/main';
const DEV_POSTGRES_URL = 'postgres://user:pass@example.neon.tech/dev';
const TRACKED_ENV_KEYS = [
  'FUNSAVER_DATA_PATH',
  'DATABASE_URL',
  'DEV_DATABASE_URL',
  'NODE_ENV',
] as const;

describe('getStore', () => {
  let directory: string;

  withCleanEnv(TRACKED_ENV_KEYS);

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'funsaver-'));
  });

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  describe('with FUNSAVER_DATA_PATH', () => {
    let dataPath: string;

    beforeEach(() => {
      dataPath = join(directory, 'data.json');
      mutableEnv.FUNSAVER_DATA_PATH = dataPath;
    });

    it('returns a file-backed store at that path', async () => {
      await getStore().insertAccount(mockAccount);

      expect(existsSync(dataPath)).toBe(true);
      expect(
        (await getStore().listAccounts()).map((account) => account.id)
      ).toEqual([mockAccount.id]);
    });

    it('memoizes one store per path', () => {
      expect(getStore()).toBe(getStore());
    });

    it('rebuilds the store when the path changes', () => {
      const first = getStore();
      mutableEnv.FUNSAVER_DATA_PATH = join(directory, 'other.json');

      expect(getStore()).not.toBe(first);
    });

    it('takes precedence over a database url', () => {
      mutableEnv.DATABASE_URL = POSTGRES_URL;

      expect(getStore()).toBeInstanceOf(JsonFileStore);
    });
  });

  describe('without FUNSAVER_DATA_PATH', () => {
    it('returns a Postgres store for DATABASE_URL', () => {
      mutableEnv.DATABASE_URL = POSTGRES_URL;

      expect(getStore()).toBeInstanceOf(PostgresStore);
    });

    it('falls back to a file-backed store when nothing is configured', () => {
      expect(getStore()).toBeInstanceOf(JsonFileStore);
    });

    describe('in development', () => {
      beforeEach(() => {
        mutableEnv.NODE_ENV = 'development';
      });

      it('reads DEV_DATABASE_URL', () => {
        mutableEnv.DEV_DATABASE_URL = DEV_POSTGRES_URL;

        expect(getStore()).toBeInstanceOf(PostgresStore);
      });

      it('ignores DATABASE_URL', () => {
        mutableEnv.DATABASE_URL = POSTGRES_URL;

        expect(getStore()).toBeInstanceOf(JsonFileStore);
      });
    });
  });
});
