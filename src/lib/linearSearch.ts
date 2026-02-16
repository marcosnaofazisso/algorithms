import { VisualizationState, FlowStep } from '@/types/algorithms';

export interface AnimationStep extends VisualizationState {
  flowStep: FlowStep;
  message?: string;
}

export async function* linearSearchGenerator(
  data: number[],
  target: number
): AsyncGenerator<AnimationStep> {
  // Start
  yield {
    data,
    currentIndex: -1,
    targetValue: target,
    found: false,
    isRunning: true,
    isComplete: false,
    flowStep: 'start',
    message: 'Starting linear search'
  };

  // Initialize i = 0
  yield {
    data,
    currentIndex: 0,
    targetValue: target,
    found: false,
    isRunning: true,
    isComplete: false,
    flowStep: 'init',
    message: 'Initialize index i = 0'
  };

  // Loop through array
  for (let i = 0; i < data.length; i++) {
    // Check if i < length (true while in loop)
    yield {
      data,
      currentIndex: i,
      targetValue: target,
      found: false,
      isRunning: true,
      isComplete: false,
      flowStep: 'check-length',
      message: `Checking if ${i} < ${data.length} (true)`
    };

    // Compare arr[i] with target
    const compareResult = data[i] === target;
    yield {
      data,
      currentIndex: i,
      targetValue: target,
      found: false,
      isRunning: true,
      isComplete: false,
      flowStep: 'compare',
      message: `Comparing arr[${i}] (${data[i]}) with target (${target}) (${compareResult})`
    };

    // If found
    if (data[i] === target) {
      yield {
        data,
        currentIndex: i,
        targetValue: target,
        found: true,
        isRunning: false,
        isComplete: true,
        flowStep: 'found',
        message: `Found! Element ${target} at index ${i}`
      };
      return;
    }

    // Increment
    yield {
      data,
      currentIndex: i,
      targetValue: target,
      found: false,
      isRunning: true,
      isComplete: false,
      flowStep: 'increment',
      message: `Not a match. Moving to next element (i++)`
    };
  }

  // Not found - final check (i < length is false)
  yield {
    data,
    currentIndex: -1,
    targetValue: target,
    found: false,
    isRunning: false,
    isComplete: false,
    flowStep: 'check-length',
    message: `Reached end of array (${data.length} >= ${data.length}) (false)`
  };

  // Return -1 (not found)
  yield {
    data,
    currentIndex: -1,
    targetValue: target,
    found: false,
    isRunning: false,
    isComplete: true,
    flowStep: 'not-found',
    message: `Element ${target} not found in array`
  };
}
