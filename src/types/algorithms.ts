export interface Algorithm {
  id: string;
  name: string;
  category: 'search' | 'sorting' | 'trees';
  description: string;
  /** What the algorithm is for (shown in "Read more") */
  whatFor?: string;
  /** Best use case and why (shown in "Read more") */
  bestUseCase?: string;
  /** Performance notes: is it slow/fast, when to use (shown in "Read more") */
  performance?: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  pythonCode: string;
}

export interface VisualizationState {
  data: number[];
  currentIndex: number;
  targetValue: number | null;
  found: boolean;
  isRunning: boolean;
  isComplete: boolean;
  /** Binary search: left bound of search range */
  left?: number;
  /** Binary search: right bound of search range */
  right?: number;
  /** Binary search: middle index (can also use currentIndex as mid) */
  mid?: number;
  /** Sorting: index of the key element being inserted (e.g. i) */
  keyIndex?: number;
  /** Sorting: index we are comparing with (e.g. j) */
  compareIndex?: number;
  /** Sorting: end index of the sorted region (0..sortedEndIndex-1) */
  sortedEndIndex?: number;
}

export type FlowStep =
  | 'start'
  | 'init'
  | 'check-length'
  | 'compare'
  | 'found'
  | 'increment'
  | 'not-found'
  | 'check'
  | 'mid'
  | 'go-left'
  | 'go-right'
  // Insertion sort
  | 'for-i'
  | 'key'
  | 'while-j'
  | 'compare-sort'
  | 'shift'
  | 'j-decrement'
  | 'insert'
  | 'next-i'
  | 'done'
  // Merge sort
  | 'merge-start'
  | 'merge-divide'
  | 'merge-conquer'
  | 'merge-merge'
  | 'merge-compare'
  | 'merge-copy'
  | 'merge-copy-remaining'
  | 'merge-done'
  // Bubble sort
  | 'bubble-start'
  | 'bubble-outer'
  | 'bubble-inner'
  | 'bubble-compare'
  | 'bubble-swap'
  | 'bubble-no-swap'
  | 'bubble-done'
  // Quick sort
  | 'quick-start'
  | 'quick-pivot'
  | 'quick-partition'
  | 'quick-compare'
  | 'quick-swap'
  | 'quick-place-pivot'
  | 'quick-recurse'
  | 'quick-done'
  // Selection sort
  | 'sel-start'
  | 'sel-outer'
  | 'sel-inner'
  | 'sel-compare'
  | 'sel-update-min'
  | 'sel-swap'
  | 'sel-done'
  // Heap sort
  | 'heap-start'
  | 'heap-build'
  | 'heapify'
  | 'heap-swap'
  | 'heap-sift'
  | 'heap-done'
  // Counting sort
  | 'count-start'
  | 'count-count'
  | 'count-prefix'
  | 'count-place'
  | 'count-done'
  // Radix sort
  | 'radix-start'
  | 'radix-digit'
  | 'radix-bucket'
  | 'radix-concat'
  | 'radix-done'
  // Bucket sort
  | 'bucket-start'
  | 'bucket-distribute'
  | 'bucket-sort'
  | 'bucket-concat'
  | 'bucket-done'
  // Binary tree
  | 'bt-start'
  | 'bt-action'
  | 'bt-search'
  | 'bt-insert'
  | 'bt-remove'
  | 'bt-invert'
  | 'bt-done';
