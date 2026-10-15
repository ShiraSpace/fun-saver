import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { type Readable } from 'node:stream';
import { TEST_AUTH_SECRET } from './driver/auth-session';

const NEXT_COMMAND = join('node_modules', '.bin', 'next');

const ANY_FREE_PORT = '0';

const SERVER_ADDRESS_LINE = /- Local:\s+(http:\/\/\S+)/;

const SERVER_READY_LINE = 'Ready in';

type ServerProcess = ChildProcessByStdio<null, Readable, null>;

export interface RunningServer {
  baseUrl: string;
  storePath: string;
  authSecret: string;
  stop: () => Promise<void>;
}

export async function startServer(): Promise<RunningServer> {
  const storeDir = await mkdtemp(join(tmpdir(), 'funsaver-e2e-'));
  const storePath = join(storeDir, 'data.json');

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    FUNSAVER_DATA_PATH: storePath,
    FUNSAVER_NOW: '2026-01-01',
    AUTH_SECRET: TEST_AUTH_SECRET,
    AUTH_TRUST_HOST: 'true',
  };
  const server = spawn(NEXT_COMMAND, ['start', '-p', ANY_FREE_PORT], {
    env,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  const baseUrl = await serverAddressOnceReady(server);

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

function serverAddressOnceReady(server: ServerProcess): Promise<string> {
  return new Promise((resolve, reject) => {
    let baseUrl = '';
    server.once('exit', (code) => {
      reject(new Error(`server exited with code ${code} before it was ready`));
    });
    createInterface({ input: server.stdout }).on('line', (line) => {
      console.log(line);
      baseUrl ||= SERVER_ADDRESS_LINE.exec(line)?.[1] ?? '';
      if (baseUrl && line.includes(SERVER_READY_LINE)) resolve(baseUrl);
    });
  });
}
