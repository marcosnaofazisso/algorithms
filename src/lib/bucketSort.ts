import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface BucketSortStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

const baseState = (): Omit<BucketSortStep, 'flowStep' | 'message'> => ({
  currentIndex: -1,
  targetValue: null,
  found: false,
  isRunning: true,
  isComplete: false,
  keyIndex: undefined,
  compareIndex: undefined,
  sortedEndIndex: undefined,
});

export async function* bucketSortGenerator(
  data: number[]
): AsyncGenerator<BucketSortStep> {
  const arr = [...data];
  const n = arr.length;

  yield { ...baseState(), data: [...arr], flowStep: 'bucket-start', message: 'Starting bucket sort' };

  if (n <= 1) {
    yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'bucket-done', message: 'Array has 0 or 1 element.' };
    return;
  }

  const bucketCount = Math.min(10, n);
  const minVal = Math.min(...arr);
  const maxVal = Math.max(...arr);
  const range = maxVal - minVal || 1;
  const bucketSize = range / bucketCount;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  yield { ...baseState(), data: [...arr], flowStep: 'bucket-distribute', message: `Distribute into ${bucketCount} buckets` };
  for (let i = 0; i < n; i++) {
    const idx = Math.min(Math.floor((arr[i] - minVal) / bucketSize), bucketCount - 1);
    buckets[idx].push(arr[i]);
    yield {
      ...baseState(),
      data: [...arr],
      currentIndex: i,
      keyIndex: i,
      flowStep: 'bucket-distribute',
      message: `Put ${arr[i]} in bucket ${idx}`,
    };
  }

  yield { ...baseState(), data: [...arr], flowStep: 'bucket-sort', message: 'Sort each bucket (insertion sort)' };
  let outIdx = 0;
  for (let b = 0; b < bucketCount; b++) {
    buckets[b].sort((a, b) => a - b);
    for (let k = 0; k < buckets[b].length; k++) {
      arr[outIdx] = buckets[b][k];
      outIdx++;
      yield {
        ...baseState(),
        data: [...arr],
        currentIndex: outIdx - 1,
        keyIndex: outIdx - 1,
        sortedEndIndex: outIdx,
        flowStep: 'bucket-concat',
        message: `Concat bucket ${b}: place ${buckets[b][k]} at index ${outIdx - 1}`,
      };
    }
  }

  yield { ...baseState(), data: [...arr], isRunning: false, isComplete: true, sortedEndIndex: n, flowStep: 'bucket-done', message: 'Array sorted.' };
}
