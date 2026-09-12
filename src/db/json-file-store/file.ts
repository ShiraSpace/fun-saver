import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { StoreData } from '../data-store';

let writeSequence = 0;

export function emptyData(): StoreData {
  return { accounts: [], transactions: [] };
}

export async function persist(
  filePath: string,
  data: StoreData
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${writeSequence++}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(data, null, 2), 'utf8');
  await rename(temporaryPath, filePath);
}

export async function readFromDisk(filePath: string): Promise<StoreData> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return { ...emptyData(), ...(JSON.parse(raw) as Partial<StoreData>) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const empty = emptyData();
      await persist(filePath, empty);
      return empty;
    }

    throw error;
  }
}
