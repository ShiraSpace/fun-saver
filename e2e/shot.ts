import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { StoreContents } from '@/db/data-store';
import { AppBrowser } from './driver/app-browser';
import { PHONE, RETINA_SCALE } from './driver/viewports';
import {
  createAppDriver,
  openApp,
  startApp,
  type AppDriver,
} from './driver/use-driver';

const SHOT_DIR = process.env.SHOT_DIR ?? 'e2e/shots/out';

export type Shoot = (name: string) => Promise<void>;

export type TakeShots = (app: AppDriver, shoot: Shoot) => Promise<void>;

export async function withShots(
  initialStore: Partial<StoreContents>,
  takeShots: TakeShots
): Promise<void> {
  await mkdir(SHOT_DIR, { recursive: true });

  const appBrowser = AppBrowser.create();
  const server = await startApp(appBrowser);

  try {
    await openApp({ appBrowser, server, initialStore, motion: 'reduce' });
    await appBrowser.resize({ ...PHONE, deviceScaleFactor: RETINA_SCALE });
    await takeShots(createAppDriver(appBrowser), (name) =>
      shoot(appBrowser, name)
    );
  } finally {
    await appBrowser.closePage();
    await appBrowser.stop();
    await server.stop();
  }
}

async function shoot(appBrowser: AppBrowser, name: string): Promise<void> {
  const path = `${join(SHOT_DIR, name)}.png` as const;

  await appBrowser.screenshot(path);
  console.log(path);
}
