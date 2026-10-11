import type { AppDriver } from './use-driver';

export async function cameHomeFromTheMethodPage({ menu, account }: AppDriver): Promise<void> {
  await menu.open();
  await menu.openMethodPage();
  await menu.open();
  await menu.tapHomeTab();
  await account.waitForOverview();
}
