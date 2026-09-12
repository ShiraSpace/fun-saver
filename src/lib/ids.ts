export function newId(): string {
  return crypto.randomUUID();
}

export function newWalletId(name: string): string {
  return `${name}_${crypto.randomUUID().slice(0, 2)}`;
}
