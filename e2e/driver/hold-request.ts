import { type HTTPRequest, type Page } from 'puppeteer';

export interface HeldRequest {
  requested: Promise<void>;
  wasSent: () => boolean;
  answer: (status: number) => Promise<void>;
}

export async function holdRequests(
  page: Page,
  isHeld: (request: HTTPRequest) => boolean
): Promise<HTTPRequest[]> {
  const heldRequests: HTTPRequest[] = [];

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (isHeld(request)) {
      heldRequests.push(request);
      return;
    }
    void request.continue();
  });

  return heldRequests;
}

export async function holdRequest(page: Page, method: string): Promise<HeldRequest> {
  let markRequested = (): void => {};
  const requested = new Promise<void>((resolve) => {
    markRequested = resolve;
  });

  const heldRequests = await holdRequests(page, (request) => {
    const isHeld = request.method() === method;
    if (isHeld) {
      markRequested();
    }
    return isHeld;
  });

  const answer = async (status: number): Promise<void> => {
    await Promise.all(
      heldRequests.map((request) =>
        request.respond({ status, contentType: 'application/json', body: '{}' })
      )
    );
  };

  return { requested, wasSent: (): boolean => heldRequests.length > 0, answer };
}
