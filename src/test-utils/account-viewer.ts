import { readFile, writeFile } from 'node:fs/promises';
import type { StoreContents } from '@/db/data-store';
import type { User } from '@/lib/user/types';

export async function addAccountViewerToStoreFile(
  storePath: string,
  accountId: string,
  viewer: User
): Promise<void> {
  const contents: StoreContents = JSON.parse(await readFile(storePath, 'utf8'));

  contents.accountUsers.push({
    accountId,
    userId: viewer.id,
    role: 'viewer',
    addedAt: new Date().toISOString(),
  });

  await writeFile(storePath, JSON.stringify(contents));
}
