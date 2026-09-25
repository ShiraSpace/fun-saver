import { JSX } from 'react';
import { BALANCE_CHART_TEST_IDS, MESSAGE_Y } from '../constants';
import { MessageText } from './ChartMessage.styles';

interface ChartMessageProps {
  text: string;
  chartWidth: number;
}

export function ChartMessage({
  text,
  chartWidth,
}: ChartMessageProps): JSX.Element {
  const centreX = chartWidth / 2;

  return (
    <MessageText
      x={centreX}
      y={MESSAGE_Y}
      textAnchor="middle"
      data-testid={BALANCE_CHART_TEST_IDS.message}
    >
      {text}
    </MessageText>
  );
}
