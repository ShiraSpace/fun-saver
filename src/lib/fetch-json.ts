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

  if (!response.ok) {
    throw new Error(`${method} ${url} failed with ${response.status}`);
  }

  return response.json();
}
