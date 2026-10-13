import { act } from '@testing-library/react';

const HISTORY_TRAVERSAL_MS = 10;

export function historySettles(): Promise<void> {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve, HISTORY_TRAVERSAL_MS));
  });
}

export async function pressBack(): Promise<void> {
  window.history.back();
  await historySettles();
}
