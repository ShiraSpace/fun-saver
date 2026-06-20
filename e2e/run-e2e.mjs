import { spawn } from 'node:child_process';
import { rm, mkdir } from 'node:fs/promises';

const PORT = 3987;
const DATA_DIR = '.e2e-data';

async function main() {
  await rm(DATA_DIR, { recursive: true, force: true });
  await mkdir(DATA_DIR, { recursive: true });

  const env = {
    ...process.env,
    PORT: String(PORT),
    FUNSAVER_DATA_PATH: `${DATA_DIR}/data.json`,
    FUNSAVER_NOW: '2026-01-01',
  };

  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { env, stdio: 'inherit' });
  try {
    await waitForServer(`http://localhost:${PORT}`);
    const test = spawn('node', ['e2e/createAccount.e2e.mjs'], {
      env: { ...env, BASE_URL: `http://localhost:${PORT}` },
      stdio: 'inherit',
    });
    const code = await new Promise((res) => test.on('exit', res));
    process.exitCode = code ?? 1;
  } finally {
    server.kill('SIGTERM');
  }
}

async function waitForServer(url) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('server did not start');
}

main();
