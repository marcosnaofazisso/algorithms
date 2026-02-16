import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface BinarySearchAnimationStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

export async function* binarySearchGenerator(
  data: number[],
  target: number
): AsyncGenerator<BinarySearchAnimationStep> {
  let left = 0;
  let right = data.length - 1;

  // Start
  yield {
    data,
    currentIndex: -1,
    targetValue: target,
    found: false,
    isRunning: true,
    isComplete: false,
    flowStep: 'start',
    message: 'Starting binary search (array must be sorted)',
  };

  // Init: left = 0, right = n - 1
  yield {
    data,
    currentIndex: -1,
    targetValue: target,
    found: false,
    isRunning: true,
    isComplete: false,
    left: 0,
    right: data.length - 1,
    mid: undefined,
    flowStep: 'init',
    message: `Initialize left = 0, right = ${data.length - 1}`,
  };

  while (left <= right) {
    // Check: left <= right? (always true when we enter the loop)
    yield {
      data,
      currentIndex: -1,
      targetValue: target,
      found: false,
      isRunning: true,
      isComplete: false,
      left,
      right,
      mid: undefined,
      flowStep: 'check',
      message: `Checking if left (${left}) <= right (${right}) (true)`,
    };

    const mid = Math.floor((left + right) / 2);

    // Compute mid
    yield {
      data,
      currentIndex: mid,
      targetValue: target,
      found: false,
      isRunning: true,
      isComplete: false,
      left,
      right,
      mid,
      flowStep: 'mid',
      message: `mid = (${left} + ${right}) / 2 = ${mid}`,
    };

    // Compare arr[mid] with target
    const compareResult = data[mid] === target;
    yield {
      data,
      currentIndex: mid,
      targetValue: target,
      found: false,
      isRunning: true,
      isComplete: false,
      left,
      right,
      mid,
      flowStep: 'compare',
      message: `Comparing arr[${mid}] (${data[mid]}) with target (${target}) (${compareResult})`,
    };

    if (data[mid] === target) {
      yield {
        data,
        currentIndex: mid,
        targetValue: target,
        found: true,
        isRunning: false,
        isComplete: true,
        left,
        right,
        mid,
        flowStep: 'found',
        message: `Found! Element ${target} at index ${mid}`,
      };
      return;
    }

    if (data[mid] < target) {
      yield {
        data,
        currentIndex: mid,
        targetValue: target,
        found: false,
        isRunning: true,
        isComplete: false,
        left,
        right,
        mid,
        flowStep: 'go-right',
        message: `arr[${mid}] < target. Set left = mid + 1 = ${mid + 1}`,
      };
      left = mid + 1;
    } else {
      yield {
        data,
        currentIndex: mid,
        targetValue: target,
        found: false,
        isRunning: true,
        isComplete: false,
        left,
        right,
        mid,
        flowStep: 'go-left',
        message: `arr[${mid}] > target. Set right = mid - 1 = ${mid - 1}`,
      };
      right = mid - 1;
    }
  }

  // Not found: left > right
  yield {
    data,
    currentIndex: -1,
    targetValue: target,
    found: false,
    isRunning: false,
    isComplete: true,
    left,
    right,
    mid: undefined,
    flowStep: 'not-found',
    message: `Element ${target} not found in array (left > right)`,
  };
}
