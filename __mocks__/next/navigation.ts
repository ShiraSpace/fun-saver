export function useRouter(): { push: () => void; refresh: () => void } {
  return { push: () => undefined, refresh: () => undefined };
}
