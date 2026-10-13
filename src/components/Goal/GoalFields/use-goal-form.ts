import { FormEvent, useState } from 'react';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
import type { GoalPicture, GoalRequest } from '@/lib/goal/types';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { GOAL_AMOUNT_ENTRY } from './GoalAmountField/constants';
import {
  goalEntryErrors,
  hasGoalEntryErrors,
  NO_GOAL_ENTRY_ERRORS,
  type GoalEntryErrors,
} from './goal-entry';

export interface GoalFormOptions {
  onSubmit: (request: GoalRequest) => Promise<void>;
  onRequestStateChange: (requestState: RequestState) => void;
}

interface GoalFormState {
  goalName: string;
  setGoalName: (goalName: string) => void;
  amountShekels: number;
  setAmount: (typed: string) => void;
  picture: GoalPicture | null;
  setPicture: (picture: GoalPicture) => void;
  requestState: RequestState;
  errors: GoalEntryErrors;
  handleSubmit: (submitEvent: FormEvent<HTMLFormElement>) => void;
}

interface GoalRequestState {
  requestState: RequestState;
  sendGoal: (request: GoalRequest) => Promise<void>;
}

function amountFrom(typed: string): number {
  return Number(typed.replace(GOAL_AMOUNT_ENTRY.notDigits, ''));
}

function useGoalRequest({ onSubmit, onRequestStateChange }: GoalFormOptions): GoalRequestState {
  const [requestState, setRequestState] = useState<RequestState>(REQUEST_STATE.idle);

  const reportRequestState = (nextRequestState: RequestState): void => {
    setRequestState(nextRequestState);
    onRequestStateChange(nextRequestState);
  };

  const sendGoal = async (request: GoalRequest): Promise<void> => {
    reportRequestState(REQUEST_STATE.pending);

    try {
      await onSubmit(request);
    } catch {
      reportRequestState(REQUEST_STATE.failed);
    }
  };

  return { requestState, sendGoal };
}

export function useGoalForm(options: GoalFormOptions): GoalFormState {
  const [goalName, setGoalName] = useState('');
  const [amountShekels, setAmountShekels] = useState(0);
  const [picture, setPicture] = useState<GoalPicture | null>(null);
  const [showsErrors, setShowsErrors] = useState(false);
  const { requestState, sendGoal } = useGoalRequest(options);
  const errors = goalEntryErrors({ goalName, amountShekels });

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>): void => {
    submitEvent.preventDefault();
    setShowsErrors(true);

    if (requestState === REQUEST_STATE.pending || hasGoalEntryErrors(errors)) {
      return;
    }

    void sendGoal({
      name: goalName.trim(),
      amount: amountShekels,
      picture: picture ?? DEFAULT_GOAL_PICTURE,
    });
  };

  return {
    goalName,
    setGoalName,
    amountShekels,
    setAmount: (typed): void => setAmountShekels(amountFrom(typed)),
    picture,
    setPicture,
    requestState,
    errors: showsErrors ? errors : NO_GOAL_ENTRY_ERRORS,
    handleSubmit,
  };
}
