import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TEST_AUTH_SECRET } from './driver/auth-session';

export interface RunningServer {
  baseUrl: string;
  storePath: string;
  authSecret: string;
  stop: () => Promise<void>;
}

export async function startServer(): Promise<RunningServer> {
  const port = await getFreePort();
  const storeDir = await mkdtemp(join(tmpdir(), 'funsaver-e2e-'));
  const storePath = join(storeDir, 'data.json');

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: String(port),
    FUNSAVER_DATA_PATH: storePath,
    FUNSAVER_NOW: '2026-01-01',
    AUTH_SECRET: TEST_AUTH_SECRET,
    AUTH_TRUST_HOST: 'true',
  };
  const baseUrl = `http://localhost:${port}`;
  const server = spawn('npx', ['next', 'start', '-p', String(port)], {
    env,
    stdio: 'inherit',
  });

  await waitForServer(baseUrl);

  return {
    baseUrl,
    storePath,
    authSecret: TEST_AUTH_SECRET,
    stop: async (): Promise<void> => {
      server.kill('SIGTERM');
      await rm(storeDir, { recursive: true, force: true });
    },
  };
}

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const portFinder = createServer();
    portFinder.once('error', reject);
    portFinder.listen(0, () => {
      const { port } = portFinder.address() as { port: number };
      portFinder.close(() => resolve(port));
    });
  });
}

async function waitForServer(url: string): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) return;
    } catch {
      void 0;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('server did not start');
}
