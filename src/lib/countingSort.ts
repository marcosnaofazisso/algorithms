import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface CountingSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

const MAX_VAL = 20;

const baseState = (): Omit<CountingSortStep, 'flowStep' | 'message'> => ({
  currentIndex: -1,
  targetValue: null,
  found: false,
  isRunning: true,
  isComplete: false,
  keyIndex: undefined,
  compareIndex: undefined,
  sortedEndIndex: undefined,
});

export async function* countingSortGenerator(
  data: number[]
): AsyncGenerator<CountingSortStep> {
  const arr = [...data];
  const n = arr.length;

  yield { ...baseState(), data: [...arr], flowStep: 'count-start', message: 'Starting counting sort (range 0..' + MAX_VAL + ')' };

  if (n <= 1) {
    yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'count-done', message: 'Array has 0 or 1 element.' };
    return;
  }

  const count = new Array(MAX_VAL + 1).fill(0);

  yield { ...baseState(), data: [...arr], flowStep: 'count-count', message: 'Count frequency of each value' };
  for (let i = 0; i < n; i++) {
    const v = arr[i];
    if (v >= 0 && v <= MAX_VAL) count[v]++;
    yield {
      ...baseState(),
      data: [...arr],
      currentIndex: i,
      keyIndex: i,
      flowStep: 'count-count',
      message: `count[${v}]++`,
    };
  }

  yield { ...baseState(), data: [...arr], flowStep: 'count-prefix', message: 'Prefix sum (cumulative counts)' };
  for (let i = 1; i <= MAX_VAL; i++) {
    count[i] += count[i - 1];
  }

  yield { ...baseState(), data: [...arr], flowStep: 'count-place', message: 'Place each element in sorted position (stable)' };
  const out = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    const v = arr[i];
    const pos = count[v] - 1;
    out[pos] = v;
    count[v]--;
    yield {
      ...baseState(),
      data: [...arr],
      currentIndex: pos,
      keyIndex: i,
      compareIndex: pos,
      flowStep: 'count-place',
      message: `Place ${v} at index ${pos}`,
    };
  }

  for (let i = 0; i < n; i++) arr[i] = out[i];

  yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'count-done', message: 'Array sorted.' };
}
