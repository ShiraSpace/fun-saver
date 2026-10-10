import { readFile, rename, writeFile } from 'node:fs/promises';
import type { StoreContents } from '@/db/data-store';
import type { Goal } from '@/lib/goal/types';

export class StoreDriver {
  constructor(private readonly storePath: () => string) {}

  async addGoal(goal: Goal): Promise<void> {
    const contents: StoreContents = JSON.parse(
      await readFile(this.storePath(), 'utf8')
    );
    const temporaryPath = `${this.storePath()}.goal.tmp`;

    contents.goals.push(goal);
    await writeFile(temporaryPath, JSON.stringify(contents, null, 2), 'utf8');
    await rename(temporaryPath, this.storePath());
  }
}
