import { type HTTPRequest, type Page } from 'puppeteer';

export interface HeldRequest {
  requested: Promise<void>;
  wasSent: () => boolean;
  answer: (status: number) => Promise<void>;
}

export async function holdRequest(page: Page, method: string): Promise<HeldRequest> {
  const heldRequests: HTTPRequest[] = [];
  let markRequested = (): void => {};
  const requested = new Promise<void>((resolve) => {
    markRequested = resolve;
  });

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (request.method() === method) {
      heldRequests.push(request);
      markRequested();
      return;
    }
    void request.continue();
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
