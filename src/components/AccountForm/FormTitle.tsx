import { JSX, ReactNode } from 'react';
import { ACCOUNT_FORM_TEST_IDS } from './constants';
import { Title, TitleIcon } from './AccountForm.styles';

interface FormTitleProps {
  title: string;
  titleIcon?: ReactNode;
}

export function FormTitle({ title, titleIcon }: FormTitleProps): JSX.Element {
  const icon = titleIcon ? (
    <TitleIcon aria-hidden="true" data-testid={ACCOUNT_FORM_TEST_IDS.titleIcon}>
      {titleIcon}
    </TitleIcon>
  ) : null;

  return (
    <Title data-testid={ACCOUNT_FORM_TEST_IDS.title}>
      {icon}
      {title}
    </Title>
  );
}
