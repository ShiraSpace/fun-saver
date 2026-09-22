import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { StoreData } from '@/db/data-store';
import { mockUser } from '@/test-utils/fixtures';
import { sessionCookie } from './driver/auth-session';
import { Session } from './driver/session';
import { createDrivers, seedStore, type AppDriver } from './driver/use-driver';
import { startServer } from './server';

const SHOT_DIR = process.env.SHOT_DIR ?? 'e2e/shots/out';
const PHONE_VIEWPORT = {
  width: 402,
  height: 874,
  deviceScaleFactor: 2,
} as const;

export type Shoot = (name: string) => Promise<string>;

export type TakeShots = (app: AppDriver, shoot: Shoot) => Promise<void>;

export async function withShots(
  state: Partial<StoreData>,
  takeShots: TakeShots
): Promise<void> {
  await mkdir(SHOT_DIR, { recursive: true });

  const session = Session.create();
  const [server] = await Promise.all([startServer(), session.start()]);

  try {
    await seedStore(server.dataPath, state);
    await session.open({
      baseUrl: server.baseUrl,
      motion: 'reduce',
      cookie: await sessionCookie(mockUser, server.authSecret),
    });
    await session.resize(PHONE_VIEWPORT);
    await takeShots(createDrivers(session), (name) => shoot(session, name));
  } finally {
    await session.closePage();
    await session.stop();
    await server.stop();
  }
}

async function shoot(session: Session, name: string): Promise<string> {
  const path = join(SHOT_DIR, `${name}.png`) as `${string}.png`;

  await session.screenshot(path);
  console.log(path);

  return path;
}
