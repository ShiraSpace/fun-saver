import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { StoreData } from '../data-store';

let writeSequence = 0;

function emptyData(): StoreData {
  return { accounts: [], transactions: [], users: [] };
}

/**
 * Owns every read and write of the store file. Repositories share one session
 * so their operations queue against each other instead of clobbering the file;
 * disk access stays private here so a new repository cannot bypass the queue.
 */
export class FileSession {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  read<T>(operation: (data: StoreData) => T): Promise<T> {
    return this.enqueue(async (): Promise<T> =>
      operation(await this.readFromDisk())
    );
  }

  write<T>(
    operation: (data: StoreData, save: () => Promise<void>) => Promise<T>
  ): Promise<T> {
    return this.enqueue(async (): Promise<T> => {
      const data = await this.readFromDisk();

      return operation(data, () => this.persist(data));
    });
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(operation, operation);
    this.queue = result.then(
      (): undefined => undefined,
      (): undefined => undefined
    );
    return result;
  }

  private async persist(data: StoreData): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.${process.pid}.${writeSequence++}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(data, null, 2), 'utf8');
    await rename(temporaryPath, this.filePath);
  }

  private async readFromDisk(): Promise<StoreData> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return { ...emptyData(), ...(JSON.parse(raw) as Partial<StoreData>) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const empty = emptyData();
        await this.persist(empty);
        return empty;
      }

      throw error;
    }
  }
}
