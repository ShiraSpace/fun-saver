export async function jsonBody<Body>(request: Request): Promise<Body | null> {
  return (await request.json().catch(() => null)) as Body | null;
}
