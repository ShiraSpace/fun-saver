import { HOME_ROUTE } from '@/components/Home/constants';

export const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
};

let currentPathname: string = HOME_ROUTE;

export function setMockPathname(pathname: string): void {
  currentPathname = pathname;
}

export function resetNavigationMock(): void {
  currentPathname = HOME_ROUTE;
  mockRouter.push.mockClear();
  mockRouter.refresh.mockClear();
}

export function useRouter(): typeof mockRouter {
  return mockRouter;
}

export function usePathname(): string {
  return currentPathname;
}
