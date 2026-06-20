import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface RunningServer {
  baseUrl: string;
  dataPath: string;
  stop: () => Promise<void>;
}

export async function startServer(): Promise<RunningServer> {
  const port = await getFreePort();
  const dataDir = await mkdtemp(join(tmpdir(), 'funsaver-e2e-'));
  const dataPath = join(dataDir, 'data.json');

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: String(port),
    FUNSAVER_DATA_PATH: dataPath,
    FUNSAVER_NOW: '2026-01-01',
  };
  const baseUrl = `http://localhost:${port}`;
  const server = spawn('npx', ['next', 'start', '-p', String(port)], {
    env,
    stdio: 'inherit',
  });

  await waitForServer(baseUrl);

  return {
    baseUrl,
    dataPath,
    stop: async (): Promise<void> => {
      server.kill('SIGTERM');
      await rm(dataDir, { recursive: true, force: true });
    },
  };
}

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, () => {
      const { port } = probe.address() as { port: number };
      probe.close(() => resolve(port));
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
