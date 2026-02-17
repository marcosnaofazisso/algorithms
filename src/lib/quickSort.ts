import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface QuickSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

function* quickSortGeneratorInner(
  arr: number[],
  low: number,
  high: number,
  getStepBase: () => Omit<QuickSortStep, 'flowStep' | 'message' | 'left' | 'right'>
): Generator<QuickSortStep> {
  const stepBase = () => ({
    ...getStepBase(),
    data: [...arr],
    targetValue: null,
    found: false,
  });

  if (low >= high) return;

  yield {
    ...stepBase(),
    currentIndex: high,
    keyIndex: high,
    compareIndex: low - 1,
    left: low,
    right: high,
    isRunning: true,
    isComplete: false,
    flowStep: 'quick-pivot',
    message: `Partition [${low}..${high}], pivot = arr[${high}] = ${arr[high]}`,
  };

  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    yield {
      ...stepBase(),
      currentIndex: j,
      keyIndex: high,
      compareIndex: j,
      left: low,
      right: high,
      isRunning: true,
      isComplete: false,
      flowStep: 'quick-partition',
      message: `j = ${j}, compare arr[${j}] (${arr[j]}) <= pivot (${pivot})?`,
    };

    yield {
      ...stepBase(),
      currentIndex: j,
      keyIndex: high,
      compareIndex: j,
      left: low,
      right: high,
      isRunning: true,
      isComplete: false,
      flowStep: 'quick-compare',
      message: arr[j] <= pivot ? `arr[${j}] <= pivot, swap to position ${i + 1}` : `arr[${j}] > pivot, skip`,
    };

    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield {
        ...stepBase(),
        currentIndex: j,
        keyIndex: high,
        compareIndex: i,
        left: low,
        right: high,
        isRunning: true,
        isComplete: false,
        flowStep: 'quick-swap',
        message: `Swapped arr[${i}] and arr[${j}]`,
      };
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  const pi = i + 1;

  yield {
    ...stepBase(),
    currentIndex: pi,
    keyIndex: pi,
    compareIndex: undefined,
    left: low,
    right: high,
    isRunning: true,
    isComplete: false,
    flowStep: 'quick-place-pivot',
    message: `Pivot placed at index ${pi}. Recurse on [${low}..${pi - 1}] and [${pi + 1}..${high}]`,
  };

  yield* quickSortGeneratorInner(arr, low, pi - 1, getStepBase);
  yield* quickSortGeneratorInner(arr, pi + 1, high, getStepBase);
}

export async function* quickSortGenerator(
  data: number[]
): AsyncGenerator<QuickSortStep> {
  const arr = [...data];
  const n = arr.length;

  yield {
    data: [...arr],
    currentIndex: -1,
    targetValue: null,
    found: false,
    isRunning: true,
    isComplete: false,
    keyIndex: undefined,
    compareIndex: undefined,
    sortedEndIndex: undefined,
    flowStep: 'quick-start',
    message: 'Starting quick sort',
  };

  if (n <= 1) {
    yield {
      data: [...arr],
      currentIndex: -1,
      targetValue: null,
      found: false,
      isRunning: false,
      isComplete: true,
      keyIndex: undefined,
      compareIndex: undefined,
      sortedEndIndex: n,
      flowStep: 'quick-done',
      message: 'Array has 0 or 1 element; already sorted.',
    };
    return;
  }

  const getStepBase = () => ({
    currentIndex: -1,
    isRunning: true,
    isComplete: false,
    keyIndex: undefined as number | undefined,
    compareIndex: undefined as number | undefined,
    sortedEndIndex: undefined as number | undefined,
  });

  const syncGen = quickSortGeneratorInner(arr, 0, n - 1, getStepBase);
  for (const step of syncGen) {
    yield step;
  }

  yield {
    data: [...arr],
    currentIndex: -1,
    targetValue: null,
    found: false,
    isRunning: false,
    isComplete: true,
    keyIndex: undefined,
    compareIndex: undefined,
    sortedEndIndex: n,
    flowStep: 'quick-done',
    message: 'Array sorted.',
  };
}
