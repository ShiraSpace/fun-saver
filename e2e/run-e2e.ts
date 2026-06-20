import { withServer } from './server';
import { run } from './createAccount.e2e';

async function main(): Promise<void> {
  await withServer(async ({ baseUrl }) => {
    await run(baseUrl);
    console.log('E2E PASS: open menu → create account → dashboard with 3 zero wallets');
  });
}

main().catch((error) => {
  console.error('E2E FAIL:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
