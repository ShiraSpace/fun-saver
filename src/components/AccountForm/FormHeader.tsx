import { JSX, ReactNode } from 'react';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import { Title, TitleIcon, CloseButton } from './AccountForm.styles';

interface FormHeaderProps {
  title: string;
  titleIcon?: ReactNode;
  onCancel?: () => void;
}

export function FormHeader({
  title,
  titleIcon,
  onCancel,
}: FormHeaderProps): JSX.Element {
  const icon = titleIcon ? (
    <TitleIcon aria-hidden="true" data-testid={ACCOUNT_FORM_TEST_IDS.titleIcon}>
      {titleIcon}
    </TitleIcon>
  ) : null;

  const cancelButton = onCancel ? (
    <CloseButton
      type="button"
      aria-label={ACCOUNT_FORM_COPY.cancelLabel}
      onClick={onCancel}
      data-testid={ACCOUNT_FORM_TEST_IDS.cancel}
    >
      {ACCOUNT_FORM_COPY.cancel}
    </CloseButton>
  ) : null;

  return (
    <>
      {cancelButton}
      <Title data-testid={ACCOUNT_FORM_TEST_IDS.title}>
        {icon}
        {title}
      </Title>
    </>
  );
}
