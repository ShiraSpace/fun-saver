import { after, afterEach, before, beforeEach } from 'node:test';
import { Driver } from './driver';
import { startServer, type RunningServer } from '../server';

export function useDriver(): Driver {
  const driver = Driver.create();
  let server: RunningServer;

  before(async () => {
    server = await startServer();
    await driver.start();
  });

  after(async () => {
    await driver.stop();
    await server.stop();
  });

  beforeEach(async () => {
    await driver.open(server.baseUrl);
  });

  afterEach(async () => {
    await driver.closePage();
  });

  return driver;
}
