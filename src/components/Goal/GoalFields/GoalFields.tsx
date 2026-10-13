'use client';

import { JSX } from 'react';
import type { RequestState } from '@/lib/request-state';
import { GoalPictureSearch } from '@/components/Goal/GoalPictureSearch';
import { GoalNameField } from './GoalNameField';
import { GoalPictureField } from './GoalPictureField';
import { GoalAmountField } from './GoalAmountField';
import { SavingsLockNote } from './SavingsLockNote';
import { SaveGoalButton } from './SaveGoalButton';
import { useGoalForm, type GoalFormOptions } from './use-goal-form';
import { usePictureSearch } from './use-picture-search';
import { GOAL_FIELDS_TEST_IDS } from './constants';
import { Form } from './GoalFields.styles';

interface GoalFieldsProps extends GoalFormOptions {
  savingsBalance: number;
  submitLabel: string;
  requestState: RequestState;
}

export function GoalFields(props: GoalFieldsProps): JSX.Element {
  const form = useGoalForm(props);
  const pictureSearch = usePictureSearch(form.setPicture);

  const pictureSearchSheet = pictureSearch.isOpen && (
    <GoalPictureSearch
      goalName={form.goalName}
      picture={form.picture}
      onChange={pictureSearch.choosePicture}
      onClose={pictureSearch.closeSearch}
    />
  );

  return (
    <>
      <Form data-testid={GOAL_FIELDS_TEST_IDS.form} onSubmit={form.handleSubmit}>
        <GoalNameField
          goalName={form.goalName}
          missing={form.errors.nameMissing}
          onChange={form.setGoalName}
        />
        <GoalPictureField picture={form.picture} onSearch={pictureSearch.openSearch} />
        <GoalAmountField
          amountShekels={form.amountShekels}
          errors={form.errors}
          onChange={form.setAmount}
        />
        <SavingsLockNote
          goalName={form.goalName}
          amountShekels={form.amountShekels}
          savingsBalance={props.savingsBalance}
        />
        <SaveGoalButton submitLabel={props.submitLabel} requestState={props.requestState} />
      </Form>
      {pictureSearchSheet}
    </>
  );
}
