import { type ElementHandle, type Page } from 'puppeteer';
import { getDocument, queries } from 'pptr-testing-library';

const { findByTestId, queryByTestId, queryAllByTestId } = queries;

export function findByTest(
  page: Page,
  testId: string
): Promise<ElementHandle<Element>> {
  return getDocument(page).then((root) => findByTestId(root, testId));
}

export function queryByTest(
  page: Page,
  testId: string
): Promise<ElementHandle<Element> | null> {
  return getDocument(page).then((root) => queryByTestId(root, testId));
}

export function queryAllByTest(
  page: Page,
  testId: string
): Promise<ElementHandle<Element>[]> {
  return getDocument(page).then((root) => queryAllByTestId(root, testId));
}

export async function requireMatch(
  page: Page,
  selector: string
): Promise<ElementHandle<Element>> {
  const element = await page.$(selector);

  if (!element) {
    throw new Error(`no element matches "${selector}"`);
  }

  return element;
}
