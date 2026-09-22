import { ACTIONS_COPY } from './actions';
import { BRIEF_COPY, GOAL_COPY } from './goal';
import { LIMITS_COPY } from './limits';
import { PROMISE_COPY } from './promise';
import { SCRIPTS_COPY } from './scripts';
import { SOURCES_COPY } from './sources';
import { WALLETS_COPY } from './wallets';
import { WHY_COPY } from './why';

export type {
  ActionGroup,
  ActionItem,
  ExampleRow,
  ExampleTable,
  IconLine,
  MethodBlock,
  Source,
  SourceId,
  TalkLine,
  TalkTone,
} from './types';

export const METHOD_COPY = {
  title: 'השיטה',
  goal: GOAL_COPY,
  brief: BRIEF_COPY,
  why: WHY_COPY,
  wallets: WALLETS_COPY,
  promise: PROMISE_COPY,
  actions: ACTIONS_COPY,
  scripts: SCRIPTS_COPY,
  limits: LIMITS_COPY,
  sources: SOURCES_COPY,
} as const;
