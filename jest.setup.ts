import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';
import { prefersMotion } from '@/test-utils/motion';
import { resetNavigationMock } from './__mocks__/next/navigation';

beforeEach(resetNavigationMock);

if (typeof globalThis.TextDecoder === 'undefined') {
  (globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
    TextDecoder;
}
if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder =
    TextEncoder;
}

if (typeof window !== 'undefined') {
  prefersMotion();
}
