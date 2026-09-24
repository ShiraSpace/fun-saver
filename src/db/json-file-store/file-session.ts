import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { StoreContents } from '../data-store';

let writeSequence = 0;

function emptyContents(): StoreContents {
  return { accounts: [], transactions: [], users: [], accountUsers: [] };
}

/**
 * Owns every read and write of the store file. Repositories share one session
 * so their operations queue against each other instead of clobbering the file;
 * disk access stays private here so a new repository cannot bypass the queue.
 */
export class FileSession {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  read<T>(operation: (contents: StoreContents) => T): Promise<T> {
    return this.enqueue(async (): Promise<T> =>
      operation(await this.readFromDisk())
    );
  }

  write<T>(
    operation: (
      contents: StoreContents,
      save: () => Promise<void>
    ) => Promise<T>
  ): Promise<T> {
    return this.enqueue(async (): Promise<T> => {
      const contents = await this.readFromDisk();

      return operation(contents, () => this.saveToDisk(contents));
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

  private async saveToDisk(contents: StoreContents): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.${process.pid}.${writeSequence++}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(contents, null, 2), 'utf8');
    await rename(temporaryPath, this.filePath);
  }

  private async readFromDisk(): Promise<StoreContents> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return {
        ...emptyContents(),
        ...(JSON.parse(raw) as Partial<StoreContents>),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const empty = emptyContents();
        await this.saveToDisk(empty);
        return empty;
      }

      throw error;
    }
  }
}
