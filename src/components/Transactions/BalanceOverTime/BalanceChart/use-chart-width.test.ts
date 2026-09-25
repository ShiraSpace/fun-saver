import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { UNMEASURED_CHART_WIDTH } from './constants';
import { useChartWidth } from './use-chart-width';

interface MeasuredSize {
  contentRect: { width: number };
}

let resizeChartTo: (width: number) => void = () => {};
let isMeasuring = false;

class BrowserResizeObserver {
  constructor(private readonly onResize: (sizes: MeasuredSize[]) => void) {}

  observe(target: Element): void {
    if (!(target instanceof Element)) {
      throw new TypeError('ResizeObserver can only observe an element');
    }

    isMeasuring = true;
    resizeChartTo = (width): void =>
      this.onResize([{ contentRect: { width } }]);
  }

  disconnect(): void {
    isMeasuring = false;
  }
}

function withBrowserMeasuring(): void {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    value: BrowserResizeObserver,
    configurable: true,
  });
}

function renderOnChart(
  chart: SVGSVGElement | null
): RenderHookResult<number, unknown> {
  return renderHook(() => useChartWidth({ current: chart }));
}

function aChart(): SVGSVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
}

describe('the chart’s own width', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'ResizeObserver');
    isMeasuring = false;
  });

  describe('once the chart is on screen and resized', () => {
    let chartWidth: RenderHookResult<number, unknown>;

    beforeEach(() => {
      withBrowserMeasuring();
      chartWidth = renderOnChart(aChart());
      act(() => resizeChartTo(360));
    });

    it('follows the chart’s drawn width', () => {
      expect(chartWidth.result.current).toBe(360);
    });
  });

  describe('once the chart leaves the screen', () => {
    beforeEach(() => {
      withBrowserMeasuring();
      renderOnChart(aChart()).unmount();
    });

    it('stops measuring it', () => {
      expect(isMeasuring).toBe(false);
    });
  });

  describe('before the chart is on screen', () => {
    let chartWidth: RenderHookResult<number, unknown>;

    beforeEach(() => {
      withBrowserMeasuring();
      chartWidth = renderOnChart(null);
    });

    it('keeps the width it is drawn at until measured', () => {
      expect(chartWidth.result.current).toBe(UNMEASURED_CHART_WIDTH);
    });
  });

  describe('in a browser that cannot measure', () => {
    let chartWidth: RenderHookResult<number, unknown>;

    beforeEach(() => {
      chartWidth = renderOnChart(aChart());
    });

    it('keeps the width it is drawn at', () => {
      expect(chartWidth.result.current).toBe(UNMEASURED_CHART_WIDTH);
    });
  });
});
