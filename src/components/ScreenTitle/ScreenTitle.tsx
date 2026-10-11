import { JSX, ReactNode } from 'react';
import { SCREEN_TITLE_TEST_IDS } from './constants';
import { Title, TitleIcon } from './ScreenTitle.styles';

interface ScreenTitleProps {
  title: string;
  titleIcon?: ReactNode;
}

export function ScreenTitle({ title, titleIcon }: ScreenTitleProps): JSX.Element {
  const icon = titleIcon ? (
    <TitleIcon aria-hidden="true" data-testid={SCREEN_TITLE_TEST_IDS.icon}>
      {titleIcon}
    </TitleIcon>
  ) : null;

  return (
    <Title data-testid={SCREEN_TITLE_TEST_IDS.title}>
      {icon}
      {title}
    </Title>
  );
}
