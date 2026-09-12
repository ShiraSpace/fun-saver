import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Target = 'main' | 'dev' | 'test';

function resolveTarget(): {
  name: Target;
  envVar: string;
  url: string | undefined;
} {
  if (process.argv.includes('--test'))
    return {
      name: 'test',
      envVar: 'TEST_DATABASE_URL',
      url: process.env.TEST_DATABASE_URL,
    };
  if (process.argv.includes('--dev'))
    return {
      name: 'dev',
      envVar: 'DEV_DATABASE_URL',
      url: process.env.DEV_DATABASE_URL,
    };
  return {
    name: 'main',
    envVar: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
  };
}

async function main(): Promise<void> {
  const target = resolveTarget();

  if (!target.url) throw new Error(`${target.envVar} is not set`);
  const url = target.url;

  const sql = neon(url);
  const schema = await readFile(resolve('src/db/schema.sql'), 'utf8');
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`Migration complete (${target.name} branch).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
