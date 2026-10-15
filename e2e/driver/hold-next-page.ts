import { type HTTPRequest, type Page } from 'puppeteer';
import { wait } from '@/lib/wait';
import { holdRequests } from './hold-request';

const PAGE_DATA_QUERY = '_rsc=';
const PREFETCH_HEADER = 'next-router-prefetch';
const SETTLE_MS = 300;

export interface HeldPage {
  requested: Promise<void>;
  settle: () => Promise<void>;
  release: () => void;
}

function isNextPageRequest(request: HTTPRequest): boolean {
  const isPageData = request.url().includes(PAGE_DATA_QUERY);
  const isPrefetch = PREFETCH_HEADER in request.headers();

  return isPageData && !isPrefetch;
}

export async function holdNextPage(page: Page): Promise<HeldPage> {
  let isHolding = true;
  const heldRequests = await holdRequests(
    page,
    (request) => isHolding && isNextPageRequest(request)
  );

  const settle = (): Promise<void> => wait(SETTLE_MS);

  const requested = page.waitForRequest(isNextPageRequest).then(() => {});

  const release = (): void => {
    isHolding = false;
    heldRequests.forEach((request) => void request.continue());
  };

  return {
    requested,
    settle,
    release,
  };
}
