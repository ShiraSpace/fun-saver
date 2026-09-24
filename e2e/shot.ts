import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { StoreContents } from '@/db/data-store';
import { Session } from './driver/session';
import { PHONE, RETINA_SCALE } from './driver/viewports';
import {
  createDrivers,
  openApp,
  startApp,
  type AppDriver,
} from './driver/use-driver';

const SHOT_DIR = process.env.SHOT_DIR ?? 'e2e/shots/out';

export type Shoot = (name: string) => Promise<void>;

export type TakeShots = (app: AppDriver, shoot: Shoot) => Promise<void>;

export async function withShots(
  state: Partial<StoreContents>,
  takeShots: TakeShots
): Promise<void> {
  await mkdir(SHOT_DIR, { recursive: true });

  const session = Session.create();
  const server = await startApp(session);

  try {
    await openApp({ session, server, state, motion: 'reduce' });
    await session.resize({ ...PHONE, deviceScaleFactor: RETINA_SCALE });
    await takeShots(createDrivers(session), (name) => shoot(session, name));
  } finally {
    await session.closePage();
    await session.stop();
    await server.stop();
  }
}

async function shoot(session: Session, name: string): Promise<void> {
  const path = `${join(SHOT_DIR, name)}.png` as const;

  await session.screenshot(path);
  console.log(path);
}
