import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface SelectionSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

const baseState = (): Omit<SelectionSortStep, 'flowStep' | 'message'> => ({
  currentIndex: -1,
  targetValue: null,
  found: false,
  isRunning: true,
  isComplete: false,
  keyIndex: undefined,
  compareIndex: undefined,
  sortedEndIndex: undefined,
});

export async function* selectionSortGenerator(
  data: number[]
): AsyncGenerator<SelectionSortStep> {
  const arr = [...data];
  const n = arr.length;

  yield { ...baseState(), data: [...arr], flowStep: 'sel-start', message: 'Starting selection sort' };

  if (n <= 1) {
    yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'sel-done', message: 'Array has 0 or 1 element; already sorted.' };
    return;
  }

  for (let i = 0; i < n; i++) {
    yield {
      ...baseState(),
      data: [...arr],
      keyIndex: i,
      compareIndex: i,
      sortedEndIndex: i,
      flowStep: 'sel-outer',
      message: `Outer: i = ${i}, find min in unsorted region [${i}..${n - 1}]`,
    };

    let minIdx = i;
    yield {
      ...baseState(),
      data: [...arr],
      keyIndex: i,
      compareIndex: i,
      sortedEndIndex: i,
      flowStep: 'sel-inner',
      message: `min_idx = ${i}. Scan j from ${i + 1} to ${n - 1}`,
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        ...baseState(),
        data: [...arr],
        keyIndex: minIdx,
        compareIndex: j,
        sortedEndIndex: i,
        flowStep: 'sel-compare',
        message: `Compare arr[j]=${arr[j]} with arr[min_idx]=${arr[minIdx]}`,
      };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield {
          ...baseState(),
          data: [...arr],
          keyIndex: minIdx,
          compareIndex: j,
          sortedEndIndex: i,
          flowStep: 'sel-update-min',
          message: `arr[${j}] < arr[min_idx], so min_idx = ${j}`,
        };
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield {
        ...baseState(),
        data: [...arr],
        keyIndex: i,
        compareIndex: minIdx,
        sortedEndIndex: i + 1,
        flowStep: 'sel-swap',
        message: `Swap arr[${i}] and arr[${minIdx}]`,
      };
    } else {
      yield {
        ...baseState(),
        data: [...arr],
        keyIndex: i,
        compareIndex: minIdx,
        sortedEndIndex: i + 1,
        flowStep: 'sel-swap',
        message: `No swap (min already at i)`,
      };
    }
  }

  yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'sel-done', message: 'Array sorted.' };
}
