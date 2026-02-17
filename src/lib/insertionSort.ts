import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface InsertionSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

export async function* insertionSortGenerator(
  data: number[]
): AsyncGenerator<InsertionSortStep> {
  const arr = [...data];
  const n = arr.length;

  // Start
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
    flowStep: 'start',
    message: 'Starting insertion sort',
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
      flowStep: 'done',
      message: 'Array has 0 or 1 element; already sorted.',
    };
    return;
  }

  for (let i = 1; i < n; i++) {
    // For i = 1 to n-1
    yield {
      data: [...arr],
      currentIndex: i - 1,
      targetValue: null,
      found: false,
      isRunning: true,
      isComplete: false,
      keyIndex: i,
      compareIndex: i - 1,
      sortedEndIndex: i,
      flowStep: 'for-i',
      message: `Outer loop: i = ${i} (insert arr[${i}] = ${arr[i]} into sorted region)`,
    };

    const key = arr[i];

    // key = arr[i]
    yield {
      data: [...arr],
      currentIndex: i - 1,
      targetValue: null,
      found: false,
      isRunning: true,
      isComplete: false,
      keyIndex: i,
      compareIndex: i - 1,
      sortedEndIndex: i,
      flowStep: 'key',
      message: `key = arr[${i}] = ${key}`,
    };

    let j = i - 1;

    // j = i - 1
    yield {
      data: [...arr],
      currentIndex: j,
      targetValue: null,
      found: false,
      isRunning: true,
      isComplete: false,
      keyIndex: i,
      compareIndex: j,
      sortedEndIndex: i,
      flowStep: 'while-j',
      message: `j = i - 1 = ${j}. Enter while (j >= 0 and arr[j] > key)?`,
    };

    while (j >= 0 && arr[j] > key) {
      // Compare: arr[j] > key?
      yield {
        data: [...arr],
        currentIndex: j,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: i,
        compareIndex: j,
        sortedEndIndex: i,
        flowStep: 'compare-sort',
        message: `arr[${j}] (${arr[j]}) > key (${key})? Yes. Shift.`,
      };

      // Shift: arr[j+1] = arr[j]
      arr[j + 1] = arr[j];
      yield {
        data: [...arr],
        currentIndex: j,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: i,
        compareIndex: j,
        sortedEndIndex: i,
        flowStep: 'shift',
        message: `Shift: arr[${j + 1}] = arr[${j}] (${arr[j]})`,
      };

      // j--
      j--;
      yield {
        data: [...arr],
        currentIndex: j,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: i,
        compareIndex: j,
        sortedEndIndex: i,
        flowStep: 'j-decrement',
        message: `j = ${j}. Back to while (j >= 0 and arr[j] > key)?`,
      };
    }

    // Insert: arr[j+1] = key
    arr[j + 1] = key;
    yield {
      data: [...arr],
      currentIndex: j,
      targetValue: null,
      found: false,
      isRunning: true,
      isComplete: false,
      keyIndex: j + 1,
      compareIndex: j,
      sortedEndIndex: i + 1,
      flowStep: 'insert',
      message: `Insert key ${key} at position ${j + 1}. Sorted region: indices 0..${i}.`,
    };

    // Next i (only yield if we're not on the last iteration)
    if (i < n - 1) {
      yield {
        data: [...arr],
        currentIndex: -1,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: undefined,
        compareIndex: undefined,
        sortedEndIndex: i + 1,
        flowStep: 'next-i',
        message: `Next i (i = ${i + 1}).`,
      };
    }
  }

  // Done
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
    flowStep: 'done',
    message: 'Array sorted.',
  };
}
