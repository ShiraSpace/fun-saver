import { spawn } from 'node:child_process';
import { rm, mkdir } from 'node:fs/promises';

const PORT = 3987;
const DATA_DIR = '.e2e-data';

export interface ServerContext {
  baseUrl: string;
  env: NodeJS.ProcessEnv;
}

export async function withServer<T>(
  callback: (context: ServerContext) => Promise<T>
): Promise<T> {
  await rm(DATA_DIR, { recursive: true, force: true });
  await mkdir(DATA_DIR, { recursive: true });

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: String(PORT),
    FUNSAVER_DATA_PATH: `${DATA_DIR}/data.json`,
    FUNSAVER_NOW: '2026-01-01',
  };
  const baseUrl = `http://localhost:${PORT}`;
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { env, stdio: 'inherit' });
  try {
    await waitForServer(baseUrl);
    return await callback({ baseUrl, env });
  } finally {
    server.kill('SIGTERM');
  }
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
