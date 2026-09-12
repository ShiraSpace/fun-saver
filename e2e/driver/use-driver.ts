import { rm } from 'node:fs/promises';
import { after, afterEach, before, beforeEach } from 'node:test';
import type { StoreData } from '@/db/data-store';
import { JsonFileStore } from '@/db/json-file-store';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { EDIT_ACCOUNT_TEST_IDS } from '@/components/EditAccount/constants';
import { Session } from './session';
import { MenuDriver } from './menu-driver';
import { HeaderDriver } from './header-driver';
import { EmptyStateDriver } from './empty-state-driver';
import { AccountFormDriver } from './account-form-driver';
import { AvatarPickerDriver } from './avatar-picker-driver';
import { DashboardDriver } from './dashboard-driver';
import { startServer, type RunningServer } from '../server';

export interface AppDriver {
  session: Session;
  menu: MenuDriver;
  header: HeaderDriver;
  emptyState: EmptyStateDriver;
  createAccount: AccountFormDriver;
  editAccount: AccountFormDriver;
  avatarPicker: AvatarPickerDriver;
  dashboard: DashboardDriver;
}

function createDrivers(session: Session): AppDriver {
  return {
    session,
    menu: new MenuDriver(session),
    header: new HeaderDriver(session),
    emptyState: new EmptyStateDriver(session),
    createAccount: new AccountFormDriver(
      session,
      CREATE_ACCOUNT_TEST_IDS.container
    ),
    editAccount: new AccountFormDriver(
      session,
      EDIT_ACCOUNT_TEST_IDS.container
    ),
    avatarPicker: new AvatarPickerDriver(session),
    dashboard: new DashboardDriver(session),
  };
}

async function seedStore(
  dataPath: string,
  state: Partial<StoreData>
): Promise<void> {
  await rm(dataPath, { force: true });
  const store = new JsonFileStore(dataPath);

  for (const account of state.accounts ?? []) {
    await store.insertAccount(account);
  }
  if (state.transactions?.length) {
    await store.insertTransactions(state.transactions);
  }
  for (const user of state.users ?? []) {
    await store.insertUser(user);
  }
}

export function useDriver(state: Partial<StoreData> = {}): AppDriver {
  const session = Session.create();
  const drivers = createDrivers(session);
  let server: RunningServer;

  before(async () => {
    const [running] = await Promise.all([startServer(), session.start()]);
    server = running;
  });

  after(async () => {
    await session.stop();
    await server.stop();
  });

  beforeEach(async () => {
    await seedStore(server.dataPath, state);
    await session.open(server.baseUrl);
  });

  afterEach(async () => {
    await session.closePage();
  });

  return drivers;
}
