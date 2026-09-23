import { StatusCodes } from 'http-status-codes';
import { LOGIN_PATH } from './constants';
import { goTo } from './navigate';

interface JsonRequest {
  url: string;
  method: 'POST' | 'PUT';
  body: unknown;
}

export async function fetchJson<Result>({
  url,
  method,
  body,
}: JsonRequest): Promise<Result> {
  const response = await fetch(url, {
    method,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (response.status === StatusCodes.UNAUTHORIZED) {
    goTo(LOGIN_PATH);
  }

  if (!response.ok) {
    throw new Error(`${method} ${url} failed with ${response.status}`);
  }

  return response.json();
}
