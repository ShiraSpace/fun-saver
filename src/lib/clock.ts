export function today(): string {
  const override = process.env.FUNSAVER_NOW;
  if (override) {
    return override;
  }
  return new Date().toISOString().slice(0, 10);
}
