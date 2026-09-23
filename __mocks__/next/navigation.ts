import { HOME_ROUTE } from '@/components/Home/constants';

export function useRouter(): { push: () => void; refresh: () => void } {
  return { push: () => undefined, refresh: () => undefined };
}

export function usePathname(): string {
  return HOME_ROUTE;
}
