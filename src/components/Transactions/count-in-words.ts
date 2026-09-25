export function countInWords(
  count: number,
  one: string,
  many: (count: number) => string
): string {
  return count === 1 ? one : many(count);
}
