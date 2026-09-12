import type { StoreData } from '../data-store';
import { persist, readFromDisk } from './file';

export class FileSession {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  read<T>(operation: (data: StoreData) => T): Promise<T> {
    return this.enqueue(async (): Promise<T> =>
      operation(await readFromDisk(this.filePath))
    );
  }

  write<T>(
    operation: (data: StoreData, save: () => Promise<void>) => Promise<T>
  ): Promise<T> {
    return this.enqueue(async (): Promise<T> => {
      const data = await readFromDisk(this.filePath);

      return operation(data, () => persist(this.filePath, data));
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
}
