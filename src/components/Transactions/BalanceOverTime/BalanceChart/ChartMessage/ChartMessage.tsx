import { JSX } from 'react';
import { Chart } from '../BalanceChart.styles';
import { BALANCE_CHART_TEST_IDS, CHART_BOX, VIEW_BOX } from '../constants';
import { MessageText } from './ChartMessage.styles';

interface ChartMessageProps {
  text: string;
  label?: string;
}

export function ChartMessage({
  text,
  label = text,
}: ChartMessageProps): JSX.Element {
  return (
    <Chart
      viewBox={VIEW_BOX}
      role="img"
      aria-label={label}
      data-testid={BALANCE_CHART_TEST_IDS.chart}
    >
      <MessageText
        x={CHART_BOX.width / 2}
        y={CHART_BOX.height / 2}
        textAnchor="middle"
        data-testid={BALANCE_CHART_TEST_IDS.message}
      >
        {text}
      </MessageText>
    </Chart>
  );
}
