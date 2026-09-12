import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main(): Promise<void> {
  const isTest = process.argv.includes('--test');
  const url = isTest ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

  if (!url)
    throw new Error(
      isTest ? 'TEST_DATABASE_URL is not set' : 'DATABASE_URL is not set'
    );

  const sql = neon(url);
  const schema = await readFile(resolve('src/db/schema.sql'), 'utf8');
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`Migration complete (${isTest ? 'test' : 'main'} branch).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
