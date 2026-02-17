import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface BubbleSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

export async function* bubbleSortGenerator(
  data: number[]
): AsyncGenerator<BubbleSortStep> {
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
    flowStep: 'bubble-start',
    message: 'Starting bubble sort',
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
      flowStep: 'bubble-done',
      message: 'Array has 0 or 1 element; already sorted.',
    };
    return;
  }

  for (let i = 0; i < n; i++) {
    let swapped = false;

    yield {
      data: [...arr],
      currentIndex: -1,
      targetValue: null,
      found: false,
      isRunning: true,
      isComplete: false,
      keyIndex: undefined,
      compareIndex: undefined,
      sortedEndIndex: n - i,
      flowStep: 'bubble-outer',
      message: `Outer loop: pass ${i + 1}, unsorted region 0..${n - 1 - i}`,
    };

    for (let j = 0; j < n - 1 - i; j++) {
      yield {
        data: [...arr],
        currentIndex: j,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: j,
        compareIndex: j + 1,
        sortedEndIndex: n - i,
        flowStep: 'bubble-inner',
        message: `Compare arr[${j}] = ${arr[j]} with arr[${j + 1}] = ${arr[j + 1]}`,
      };

      yield {
        data: [...arr],
        currentIndex: j,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: j,
        compareIndex: j + 1,
        sortedEndIndex: n - i,
        flowStep: 'bubble-compare',
        message: `arr[${j}] (${arr[j]}) > arr[${j + 1}] (${arr[j + 1]})? ${arr[j] > arr[j + 1] ? 'Yes, swap.' : 'No.'}`,
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        yield {
          data: [...arr],
          currentIndex: j,
          targetValue: null,
          found: false,
          isRunning: true,
          isComplete: false,
          keyIndex: j,
          compareIndex: j + 1,
          sortedEndIndex: n - i,
          flowStep: 'bubble-swap',
          message: `Swapped arr[${j}] and arr[${j + 1}]`,
        };
      } else {
        yield {
          data: [...arr],
          currentIndex: j,
          targetValue: null,
          found: false,
          isRunning: true,
          isComplete: false,
          keyIndex: j,
          compareIndex: j + 1,
          sortedEndIndex: n - i,
          flowStep: 'bubble-no-swap',
          message: 'No swap needed.',
        };
      }
    }

    if (!swapped && i > 0) break;
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
    flowStep: 'bubble-done',
    message: 'Array sorted.',
  };
}
