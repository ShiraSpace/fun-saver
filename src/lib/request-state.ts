export const REQUEST_STATE = {
  idle: 'idle',
  pending: 'pending',
  failed: 'failed',
} as const;

export type RequestState = (typeof REQUEST_STATE)[keyof typeof REQUEST_STATE];
