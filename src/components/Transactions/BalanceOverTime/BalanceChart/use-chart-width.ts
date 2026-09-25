import { useEffect, useState, type RefObject } from 'react';
import { UNMEASURED_CHART_WIDTH } from './constants';

export function useChartWidth(
  chartRef: RefObject<SVGSVGElement | null>
): number {
  const [chartWidth, setChartWidth] = useState(UNMEASURED_CHART_WIDTH);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) =>
      setChartWidth(entry.contentRect.width)
    );
    observer.observe(chart);

    return (): void => observer.disconnect();
  }, [chartRef]);

  return chartWidth;
}
