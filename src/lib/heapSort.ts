import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface HeapSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

const baseState = (): Omit<HeapSortStep, 'flowStep' | 'message'> => ({
  currentIndex: -1,
  targetValue: null,
  found: false,
  isRunning: true,
  isComplete: false,
  keyIndex: undefined,
  compareIndex: undefined,
  sortedEndIndex: undefined,
});

export async function* heapSortGenerator(
  data: number[]
): AsyncGenerator<HeapSortStep> {
  const arr = [...data];
  const n = arr.length;

  yield { ...baseState(), data: [...arr], flowStep: 'heap-start', message: 'Starting heap sort' };

  if (n <= 1) {
    yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'heap-done', message: 'Array has 0 or 1 element; already sorted.' };
    return;
  }

  // Build max heap
  yield { ...baseState(), data: [...arr], flowStep: 'heap-build', message: 'Build max heap (heapify from bottom up)' };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    let idx = i;
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let largest = idx;

      yield {
        ...baseState(),
        data: [...arr],
        keyIndex: idx,
        compareIndex: left < n ? left : undefined,
        sortedEndIndex: undefined,
        flowStep: 'heap-sift',
        message: `Heapify at index ${idx}, left=${left}, right=${right}`,
      };

      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;

      if (largest !== idx) {
        yield {
          ...baseState(),
          data: [...arr],
          keyIndex: idx,
          compareIndex: largest,
          flowStep: 'heap-sift',
          message: `Child larger: swap arr[${idx}] with arr[${largest}]`,
        };
        [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
        idx = largest;
      } else break;
    }
  }

  // Extract max repeatedly
  for (let end = n - 1; end > 0; end--) {
    yield {
      ...baseState(),
      data: [...arr],
      keyIndex: 0,
      compareIndex: end,
      sortedEndIndex: end,
      flowStep: 'heap-swap',
      message: `Swap root (max) arr[0] with arr[${end}], then heapify [0..${end - 1}]`,
    };
    [arr[0], arr[end]] = [arr[end], arr[0]];

    let idx = 0;
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let largest = idx;
      if (left < end && arr[left] > arr[largest]) largest = left;
      if (right < end && arr[right] > arr[largest]) largest = right;
      if (largest !== idx) {
        yield {
          ...baseState(),
          data: [...arr],
          keyIndex: idx,
          compareIndex: largest,
          sortedEndIndex: end,
          flowStep: 'heap-sift',
          message: `Sift down: swap arr[${idx}] with arr[${largest}]`,
        };
        [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
        idx = largest;
      } else break;
    }
  }

  yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'heap-done', message: 'Array sorted.' };
}
