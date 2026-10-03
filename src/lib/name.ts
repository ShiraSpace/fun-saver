export function isNameWithin(name: unknown, maxLength: number): name is string {
  return (
    typeof name === 'string' &&
    name.trim() !== '' &&
    name.trim().length <= maxLength
  );
}
