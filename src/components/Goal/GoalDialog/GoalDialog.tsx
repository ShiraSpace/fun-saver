'use client';

import { JSX, ReactNode } from 'react';
import { useModal } from '@/hooks/use-modal';
import { Dialog, Page } from './GoalDialog.styles';

interface GoalDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  'data-testid': string;
}

export function GoalDialog({
  title,
  onClose,
  children,
  'data-testid': testId,
}: GoalDialogProps): JSX.Element {
  const modalRef = useModal(onClose);

  return (
    <Dialog
      ref={modalRef}
      align="top"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      data-testid={testId}
    >
      <Page>{children}</Page>
    </Dialog>
  );
}
