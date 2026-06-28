export function pushDigit(current: number, digit: number): number {
  return current * 10 + digit;
}

export function popDigit(current: number): number {
  return Math.floor(current / 10);
}
