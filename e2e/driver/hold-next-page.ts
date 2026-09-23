import { type HTTPRequest, type Page } from 'puppeteer';

const PAGE_DATA_QUERY = '_rsc=';
const PREFETCH_HEADER = 'next-router-prefetch';
const SETTLE_MS = 300;

export interface HeldPage {
  waiting: Promise<void>;
  settle: () => Promise<void>;
  release: () => void;
}

function isNextPageRequest(request: HTTPRequest): boolean {
  const isPageData = request.url().includes(PAGE_DATA_QUERY);
  const isPrefetch = PREFETCH_HEADER in request.headers();

  return isPageData && !isPrefetch;
}

const pause = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function holdNextPage(page: Page): Promise<HeldPage> {
  const held: HTTPRequest[] = [];
  let isHolding = true;

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (isHolding && isNextPageRequest(request)) {
      held.push(request);
      return;
    }
    void request.continue();
  });

  const settle = (): Promise<void> => pause(SETTLE_MS);

  const waiting = page.waitForRequest(isNextPageRequest).then(() => {});

  const release = (): void => {
    isHolding = false;
    held.forEach((request) => void request.continue());
  };

  return {
    waiting,
    settle,
    release,
  };
}
