import { after, afterEach, before, beforeEach } from 'node:test';
import { Session } from './session';
import { MenuDriver } from './menu-driver';
import { HeaderDriver } from './header-driver';
import { EmptyStateDriver } from './empty-state-driver';
import { startServer, type RunningServer } from '../server';

export interface AppDriver {
  session: Session;
  menu: MenuDriver;
  header: HeaderDriver;
  emptyState: EmptyStateDriver;
}

export function useDriver(): AppDriver {
  const session = Session.create();
  const drivers: AppDriver = {
    session,
    menu: new MenuDriver(session),
    header: new HeaderDriver(session),
    emptyState: new EmptyStateDriver(session),
  };
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
    await session.open(server.baseUrl);
  });

  afterEach(async () => {
    await session.closePage();
  });

  return drivers;
}
