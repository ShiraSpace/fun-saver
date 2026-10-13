import { FormEvent, useRef, useState } from 'react';
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

export interface GoalFormState {
  goalName: string;
  setGoalName: (goalName: string) => void;
  amountShekels: number;
  setAmount: (typed: string) => void;
  picture: GoalPicture | null;
  setPicture: (picture: GoalPicture) => void;
  errors: GoalEntryErrors;
  handleSubmit: (submitEvent: Pick<FormEvent, 'preventDefault'>) => void;
}

function amountFrom(typed: string): number {
  const [wholeShekels] = typed.split(GOAL_AMOUNT_ENTRY.decimalPoint);

  return Number(wholeShekels.replace(GOAL_AMOUNT_ENTRY.notDigits, ''));
}

function useSendGoal({
  onSubmit,
  onRequestStateChange,
}: GoalFormOptions): (request: GoalRequest) => Promise<void> {
  const isRequestPendingRef = useRef(false);

  const sendGoal = async (request: GoalRequest): Promise<void> => {
    if (isRequestPendingRef.current) {
      return;
    }

    isRequestPendingRef.current = true;
    onRequestStateChange(REQUEST_STATE.pending);

    try {
      await onSubmit(request);
    } catch {
      isRequestPendingRef.current = false;
      onRequestStateChange(REQUEST_STATE.failed);
    }
  };

  return sendGoal;
}

export function useGoalForm(options: GoalFormOptions): GoalFormState {
  const [goalName, setGoalName] = useState('');
  const [amountShekels, setAmountShekels] = useState(0);
  const [picture, setPicture] = useState<GoalPicture | null>(null);
  const [showsErrors, setShowsErrors] = useState(false);
  const sendGoal = useSendGoal(options);
  const errors = goalEntryErrors({ goalName, amountShekels });

  const handleSubmit = (submitEvent: Pick<FormEvent, 'preventDefault'>): void => {
    submitEvent.preventDefault();
    setShowsErrors(true);

    if (hasGoalEntryErrors(errors)) {
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
    errors: showsErrors ? errors : NO_GOAL_ENTRY_ERRORS,
    handleSubmit,
  };
}
