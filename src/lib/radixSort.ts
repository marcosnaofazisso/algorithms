import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface RadixSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

const baseState = (): Omit<RadixSortStep, 'flowStep' | 'message'> => ({
  currentIndex: -1,
  targetValue: null,
  found: false,
  isRunning: true,
  isComplete: false,
  keyIndex: undefined,
  compareIndex: undefined,
  sortedEndIndex: undefined,
});

function getMax(arr: number[]) {
  let m = arr[0];
  for (let i = 1; i < arr.length; i++) if (arr[i] > m) m = arr[i];
  return m;
}

export async function* radixSortGenerator(
  data: number[]
): AsyncGenerator<RadixSortStep> {
  const arr = [...data];
  const n = arr.length;

  yield { ...baseState(), data: [...arr], flowStep: 'radix-start', message: 'Starting radix sort (by digits)' };

  if (n <= 1) {
    yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'radix-done', message: 'Array has 0 or 1 element.' };
    return;
  }

  const maxVal = getMax(arr);
  let exp = 1;

  while (Math.floor(maxVal / exp) > 0) {
    yield {
      ...baseState(),
      data: [...arr],
      flowStep: 'radix-digit',
      message: `Sort by digit (place value ${exp})`,
    };

    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      yield {
        ...baseState(),
        data: [...arr],
        currentIndex: i,
        keyIndex: i,
        flowStep: 'radix-bucket',
        message: `Digit of arr[${i}]=${arr[i]} is ${digit}`,
      };
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    const out = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      out[pos] = arr[i];
      count[digit]--;
      yield {
        ...baseState(),
        data: [...arr],
        currentIndex: pos,
        keyIndex: i,
        flowStep: 'radix-concat',
        message: `Place ${arr[i]} at position ${pos} by digit ${digit}`,
      };
    }
    for (let i = 0; i < n; i++) arr[i] = out[i];

    exp *= 10;
  }

  yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'radix-done', message: 'Array sorted.' };
}
