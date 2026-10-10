import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { after, afterEach, before, beforeEach } from 'node:test';
import type { CookieData } from 'puppeteer';
import type { StoreContents } from '@/db/data-store';
import { VIEW_MODE, type ViewMode } from '@/lib/view-mode';
import { VIEW_MODE_COOKIE } from '@/lib/cookies';
import {
  createMockAccountUser,
  mockOwner,
} from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { EDIT_ACCOUNT_TEST_IDS } from '@/components/EditAccount/constants';
import { APP_COOKIE_DOMAIN, sessionCookie } from './auth-session';
import { AppBrowser } from './app-browser';
import type { MotionPreference } from './page-queries';
import { MenuDriver } from './menu-driver';
import { HeaderDriver } from './header-driver';
import { EmptyStateDriver } from './empty-state-driver';
import { AccountFormDriver } from './account-form-driver';
import { AvatarPickerDriver } from './avatar-picker-driver';
import { AccountDriver } from './account-driver';
import { ChildAccountDriver } from './child-account-driver';
import { MethodDriver } from './method-driver';
import { LoadingShellDriver } from './loading-shell-driver';
import { startServer, type RunningServer } from '../server';

interface OpenAppOptions {
  appBrowser: AppBrowser;
  server: RunningServer;
  initialStore: Partial<StoreContents>;
  motion: MotionPreference;
  viewMode: ViewMode;
}

interface DriverOptions {
  motion?: MotionPreference;
  viewMode?: ViewMode;
}

export interface AppDriver {
  appBrowser: AppBrowser;
  menu: MenuDriver;
  header: HeaderDriver;
  emptyState: EmptyStateDriver;
  createAccount: AccountFormDriver;
  editAccount: AccountFormDriver;
  avatarPicker: AvatarPickerDriver;
  account: AccountDriver;
  childAccount: ChildAccountDriver;
  method: MethodDriver;
  loadingShell: LoadingShellDriver;
}

export function createAppDriver(appBrowser: AppBrowser): AppDriver {
  return {
    appBrowser,
    menu: new MenuDriver(appBrowser),
    header: new HeaderDriver(appBrowser),
    emptyState: new EmptyStateDriver(appBrowser),
    createAccount: new AccountFormDriver(
      appBrowser,
      CREATE_ACCOUNT_TEST_IDS.container
    ),
    editAccount: new AccountFormDriver(
      appBrowser,
      EDIT_ACCOUNT_TEST_IDS.container
    ),
    avatarPicker: new AvatarPickerDriver(appBrowser),
    account: new AccountDriver(appBrowser),
    childAccount: new ChildAccountDriver(appBrowser),
    method: new MethodDriver(appBrowser),
    loadingShell: new LoadingShellDriver(appBrowser),
  };
}

export async function startApp(appBrowser: AppBrowser): Promise<RunningServer> {
  const [server] = await Promise.all([startServer(), appBrowser.start()]);

  return server;
}

export async function openApp({
  appBrowser,
  server,
  initialStore,
  motion,
  viewMode,
}: OpenAppOptions): Promise<void> {
  await writeInitialStore(server.storePath, initialStore);
  await appBrowser.open({
    baseUrl: server.baseUrl,
    motion,
    cookies: [
      await sessionCookie(mockUser, server.authSecret),
      viewModeCookie(viewMode),
    ],
  });
}

function viewModeCookie(viewMode: ViewMode): CookieData {
  return {
    name: VIEW_MODE_COOKIE,
    value: viewMode,
    domain: APP_COOKIE_DOMAIN,
    path: '/',
  };
}

async function writeInitialStore(
  storePath: string,
  initialStore: Partial<StoreContents>
): Promise<void> {
  const accounts = initialStore.accounts ?? [];
  const contents: StoreContents = {
    users: [mockUser, ...(initialStore.users ?? [])],
    accounts,
    accountUsers: accounts.map((account) =>
      createMockAccountUser({
        accountId: account.id,
        userId: mockOwner.userId,
        addedAt: mockOwner.addedAt,
      })
    ),
    transactions: initialStore.transactions ?? [],
    goals: initialStore.goals ?? [],
  };

  await mkdir(dirname(storePath), { recursive: true });

  const temporaryPath = `${storePath}.seed.tmp`;

  await writeFile(temporaryPath, JSON.stringify(contents, null, 2), 'utf8');
  await rename(temporaryPath, storePath);
}

export function useDriver(
  initialStore: Partial<StoreContents> = {},
  { motion = 'reduce', viewMode = VIEW_MODE.parent }: DriverOptions = {}
): AppDriver {
  const appBrowser = AppBrowser.create();
  const appDriver = createAppDriver(appBrowser);
  let server: RunningServer;

  before(async () => {
    server = await startApp(appBrowser);
  });

  beforeEach(async () => {
    await openApp({ appBrowser, server, initialStore, motion, viewMode });
  });

  afterEach(async () => {
    await appBrowser.closePage();
  });

  after(async () => {
    await appBrowser.stop();
    await server.stop();
  });

  return appDriver;
}
