import { StatusCodes } from 'http-status-codes';
import { SIGN_IN_PATH } from '@/lib/user/constants';
import { goTo } from './navigate';

interface JsonRequest {
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

export class RequestFailedError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export function isConflict(error: unknown): boolean {
  return error instanceof RequestFailedError && error.status === StatusCodes.CONFLICT;
}

export async function fetchJson<Result>({ url, method, body }: JsonRequest): Promise<Result> {
  const response = await fetch(url, {
    method,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (response.status === StatusCodes.UNAUTHORIZED) {
    goTo(SIGN_IN_PATH);
  }

  if (!response.ok) {
    throw new RequestFailedError(
      `${method} ${url} failed with ${response.status}`,
      response.status
    );
  }

  return response.json();
}
