import type { AppDriver } from './use-driver';

export async function openedTheMethodPage({ menu }: AppDriver): Promise<void> {
  await menu.open();
  await menu.openMethodPage();
}

export async function cameHomeFromTheMethodPage(driver: AppDriver): Promise<void> {
  const { menu, account } = driver;

  await openedTheMethodPage(driver);
  await menu.open();
  await menu.tapHomeTab();
  await account.waitForOverview();
}
