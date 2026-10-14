import { type HTTPRequest, type Page } from 'puppeteer';

export interface HeldRequest {
  requested: Promise<void>;
  answer: (status: number) => Promise<void>;
}

export async function holdRequest(page: Page, method: string): Promise<HeldRequest> {
  const heldRequests: HTTPRequest[] = [];
  const isHeld = (request: HTTPRequest): boolean => request.method() === method;

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (isHeld(request)) {
      heldRequests.push(request);
      return;
    }
    void request.continue();
  });

  const requested = page.waitForRequest(isHeld).then(() => {});

  const answer = async (status: number): Promise<void> => {
    await Promise.all(
      heldRequests.map((request) =>
        request.respond({ status, contentType: 'application/json', body: '{}' })
      )
    );
  };

  return { requested, answer };
}
