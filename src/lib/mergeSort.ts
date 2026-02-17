import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface MergeSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

export async function* mergeSortGenerator(
  data: number[]
): AsyncGenerator<MergeSortStep> {
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
    flowStep: 'merge-start',
    message: 'Starting merge sort (bottom-up)',
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
      flowStep: 'merge-done',
      message: 'Array has 0 or 1 element; already sorted.',
    };
    return;
  }

  const temp = [...arr];

  for (let size = 1; size < n; size *= 2) {
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
      flowStep: 'merge-divide',
      message: `Merge pass: subarray size = ${size}`,
    };

    for (let leftStart = 0; leftStart < n - size; leftStart += 2 * size) {
      const mid = leftStart + size - 1;
      const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);

      yield {
        data: [...arr],
        currentIndex: leftStart,
        targetValue: null,
        found: false,
        isRunning: true,
        isComplete: false,
        keyIndex: leftStart,
        compareIndex: mid + 1,
        sortedEndIndex: undefined,
        left: leftStart,
        right: rightEnd,
        mid,
        flowStep: 'merge-conquer',
        message: `Merge [${leftStart}..${mid}] with [${mid + 1}..${rightEnd}]`,
      };

      let i = leftStart;
      let j = mid + 1;
      let k = leftStart;

      while (i <= mid && j <= rightEnd) {
        yield {
          data: [...arr],
          currentIndex: i,
          targetValue: null,
          found: false,
          isRunning: true,
          isComplete: false,
          keyIndex: i,
          compareIndex: j,
          sortedEndIndex: undefined,
          left: leftStart,
          right: rightEnd,
          mid,
          flowStep: 'merge-compare',
          message: `Compare arr[${i}]=${arr[i]} with arr[${j}]=${arr[j]}, take smaller`,
        };

        if (arr[i] <= arr[j]) {
          temp[k] = arr[i];
          yield {
            data: [...arr],
            currentIndex: i,
            targetValue: null,
            found: false,
            isRunning: true,
            isComplete: false,
            keyIndex: i,
            compareIndex: j,
            sortedEndIndex: undefined,
            left: leftStart,
            right: rightEnd,
            mid,
            flowStep: 'merge-copy',
            message: `Copy arr[${i}] (${arr[i]}) to position ${k}`,
          };
          i++;
        } else {
          temp[k] = arr[j];
          yield {
            data: [...arr],
            currentIndex: j,
            targetValue: null,
            found: false,
            isRunning: true,
            isComplete: false,
            keyIndex: i,
            compareIndex: j,
            sortedEndIndex: undefined,
            left: leftStart,
            right: rightEnd,
            mid,
            flowStep: 'merge-copy',
            message: `Copy arr[${j}] (${arr[j]}) to position ${k}`,
          };
          j++;
        }
        k++;
      }

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
        left: leftStart,
        right: rightEnd,
        mid,
        flowStep: 'merge-copy-remaining',
        message: 'Copy remaining elements from left or right run',
      };

      while (i <= mid) {
        temp[k] = arr[i];
        i++;
        k++;
      }
      while (j <= rightEnd) {
        temp[k] = arr[j];
        j++;
        k++;
      }

      for (let t = leftStart; t <= rightEnd; t++) {
        arr[t] = temp[t];
      }
    }
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
    flowStep: 'merge-done',
    message: 'Array sorted.',
  };
}
