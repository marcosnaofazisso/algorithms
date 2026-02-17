import type { DiagramVariant } from './positions';
import type { FlowDefinition } from './types';

const LINEAR_SEARCH: FlowDefinition = {
  nodes: [
    { id: 'start', label: 'Start' },
    { id: 'init', label: 'i = 0' },
    { id: 'check-length', label: 'i < length?', decision: true },
    { id: 'compare', label: 'arr[i] == target?', decision: true },
    { id: 'found', label: 'Return i' },
    { id: 'increment', label: 'i++' },
    { id: 'not-found', label: 'Return -1' },
  ],
  edges: [
    { id: 'e-start-init', source: 'start', target: 'init', activeSteps: ['start'] },
    { id: 'e-init-check', source: 'init', target: 'check-length', activeSteps: ['init'] },
    { id: 'e-check-compare', source: 'check-length', target: 'compare', label: 'Yes', activeSteps: ['check-length'] },
    { id: 'e-check-notfound', source: 'check-length', target: 'not-found', label: 'No', activeSteps: [] },
    { id: 'e-compare-found', source: 'compare', target: 'found', label: 'Yes', activeSteps: ['compare', 'found'] },
    { id: 'e-compare-increment', source: 'compare', target: 'increment', label: 'No', activeSteps: ['increment'] },
    { id: 'e-increment-check', source: 'increment', target: 'check-length', smoothstep: true, activeSteps: [] },
  ],
};

const BINARY_SEARCH: FlowDefinition = {
  nodes: [
    { id: 'start', label: 'Start' },
    { id: 'init', label: 'left=0, right=n-1' },
    { id: 'check', label: 'left <= right?', decision: true },
    { id: 'mid', label: 'mid = (L+R)/2' },
    { id: 'compare', label: 'arr[mid] == target?', decision: true },
    { id: 'found', label: 'Return mid' },
    { id: 'go-left', label: 'right = mid-1' },
    { id: 'go-right', label: 'left = mid+1' },
    { id: 'not-found', label: 'Return -1' },
  ],
  edges: [
    { id: 'e-start-init', source: 'start', target: 'init', activeSteps: ['start'] },
    { id: 'e-init-check', source: 'init', target: 'check', activeSteps: ['init'] },
    { id: 'e-check-mid', source: 'check', target: 'mid', label: 'Yes', activeSteps: ['check'] },
    { id: 'e-check-notfound', source: 'check', target: 'not-found', label: 'No', activeSteps: ['not-found'] },
    { id: 'e-mid-compare', source: 'mid', target: 'compare', activeSteps: ['mid'] },
    { id: 'e-compare-found', source: 'compare', target: 'found', label: 'Yes', activeSteps: ['compare', 'found'] },
    { id: 'e-compare-goleft', source: 'compare', target: 'go-left', label: 'No, >', activeSteps: ['go-left'] },
    { id: 'e-compare-goright', source: 'compare', target: 'go-right', label: 'No, <', activeSteps: ['go-right'] },
    { id: 'e-goleft-check', source: 'go-left', target: 'check', smoothstep: true, activeSteps: [] },
    { id: 'e-goright-check', source: 'go-right', target: 'check', smoothstep: true, activeSteps: [] },
  ],
};

const INSERTION_SORT: FlowDefinition = {
  nodes: [
    { id: 'start', label: 'Start' },
    { id: 'for-i', label: 'for i = 1 to n-1', decision: true },
    { id: 'key', label: 'key = arr[i]' },
    { id: 'while-j', label: 'j >= 0 and arr[j] > key?', decision: true },
    { id: 'compare-sort', label: 'arr[j] > key?', decision: true },
    { id: 'shift', label: 'arr[j+1] = arr[j]' },
    { id: 'j-decrement', label: 'j--' },
    { id: 'insert', label: 'arr[j+1] = key' },
    { id: 'next-i', label: 'next i' },
    { id: 'done', label: 'Done' },
  ],
  edges: [
    { id: 'e-start-fori', source: 'start', target: 'for-i', activeSteps: ['start'] },
    { id: 'e-fori-key', source: 'for-i', target: 'key', label: 'Yes', activeSteps: ['for-i'] },
    { id: 'e-fori-done', source: 'for-i', target: 'done', label: 'No', activeSteps: ['done'] },
    { id: 'e-key-whilej', source: 'key', target: 'while-j', activeSteps: ['key'] },
    { id: 'e-whilej-compare', source: 'while-j', target: 'compare-sort', label: 'Yes', activeSteps: ['while-j'] },
    { id: 'e-whilej-insert', source: 'while-j', target: 'insert', label: 'No', activeSteps: ['insert'] },
    { id: 'e-compare-shift', source: 'compare-sort', target: 'shift', activeSteps: ['compare-sort'] },
    { id: 'e-shift-jdec', source: 'shift', target: 'j-decrement', activeSteps: ['shift'] },
    { id: 'e-jdec-whilej', source: 'j-decrement', target: 'while-j', smoothstep: true, activeSteps: ['j-decrement'] },
    { id: 'e-insert-nexti', source: 'insert', target: 'next-i', activeSteps: ['insert'] },
    { id: 'e-nexti-fori', source: 'next-i', target: 'for-i', smoothstep: true, activeSteps: ['next-i'] },
  ],
};

const MERGE_SORT: FlowDefinition = {
  nodes: [
    { id: 'merge-start', label: 'Start' },
    { id: 'merge-divide', label: 'Size = 1, 2, 4...' },
    { id: 'merge-conquer', label: 'Merge two runs' },
    { id: 'merge-compare', label: 'Compare left[i], right[j]', decision: true },
    { id: 'merge-copy', label: 'Copy smaller' },
    { id: 'merge-copy-remaining', label: 'Copy rest' },
    { id: 'merge-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-merge-start-divide', source: 'merge-start', target: 'merge-divide', activeSteps: ['merge-start'] },
    { id: 'e-merge-divide-conquer', source: 'merge-divide', target: 'merge-conquer', activeSteps: ['merge-divide'] },
    { id: 'e-merge-conquer-compare', source: 'merge-conquer', target: 'merge-compare', activeSteps: ['merge-conquer'] },
    { id: 'e-merge-compare-copy', source: 'merge-compare', target: 'merge-copy', activeSteps: ['merge-compare'] },
    { id: 'e-merge-copy-remaining', source: 'merge-copy', target: 'merge-copy-remaining', activeSteps: ['merge-copy'] },
    { id: 'e-merge-remaining-conquer', source: 'merge-copy-remaining', target: 'merge-conquer', smoothstep: true, activeSteps: ['merge-copy-remaining'] },
    { id: 'e-merge-divide-done', source: 'merge-divide', target: 'merge-done', activeSteps: ['merge-done'] },
  ],
};

const BUBBLE_SORT: FlowDefinition = {
  nodes: [
    { id: 'bubble-start', label: 'Start' },
    { id: 'bubble-outer', label: 'for i = 0 to n-1' },
    { id: 'bubble-inner', label: 'for j = 0 to n-1-i' },
    { id: 'bubble-compare', label: 'arr[j] > arr[j+1]?', decision: true },
    { id: 'bubble-swap', label: 'Swap' },
    { id: 'bubble-no-swap', label: 'No swap' },
    { id: 'bubble-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-bubble-start-outer', source: 'bubble-start', target: 'bubble-outer', activeSteps: ['bubble-start'] },
    { id: 'e-bubble-outer-inner', source: 'bubble-outer', target: 'bubble-inner', activeSteps: ['bubble-outer'] },
    { id: 'e-bubble-inner-compare', source: 'bubble-inner', target: 'bubble-compare', activeSteps: ['bubble-inner'] },
    { id: 'e-bubble-compare-swap', source: 'bubble-compare', target: 'bubble-swap', label: 'Yes', activeSteps: ['bubble-compare', 'bubble-swap'] },
    { id: 'e-bubble-compare-noswap', source: 'bubble-compare', target: 'bubble-no-swap', label: 'No', activeSteps: ['bubble-no-swap'] },
    { id: 'e-bubble-swap-inner', source: 'bubble-swap', target: 'bubble-inner', smoothstep: true, activeSteps: ['bubble-swap'] },
    { id: 'e-bubble-noswap-inner', source: 'bubble-no-swap', target: 'bubble-inner', smoothstep: true, activeSteps: ['bubble-no-swap'] },
    { id: 'e-bubble-outer-done', source: 'bubble-outer', target: 'bubble-done', activeSteps: ['bubble-done'] },
  ],
};

const QUICK_SORT: FlowDefinition = {
  nodes: [
    { id: 'quick-start', label: 'Start' },
    { id: 'quick-pivot', label: 'Pivot = arr[high]' },
    { id: 'quick-partition', label: 'Partition [low..high]' },
    { id: 'quick-compare', label: 'arr[j] <= pivot?', decision: true },
    { id: 'quick-swap', label: 'Swap to left' },
    { id: 'quick-place-pivot', label: 'Place pivot' },
    { id: 'quick-recurse', label: 'Recurse left/right' },
    { id: 'quick-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-quick-start-pivot', source: 'quick-start', target: 'quick-pivot', activeSteps: ['quick-start'] },
    { id: 'e-quick-pivot-partition', source: 'quick-pivot', target: 'quick-partition', activeSteps: ['quick-pivot'] },
    { id: 'e-quick-partition-compare', source: 'quick-partition', target: 'quick-compare', activeSteps: ['quick-partition'] },
    { id: 'e-quick-compare-swap', source: 'quick-compare', target: 'quick-swap', label: 'Yes', activeSteps: ['quick-compare', 'quick-swap'] },
    { id: 'e-quick-compare-partition', source: 'quick-compare', target: 'quick-partition', label: 'No', activeSteps: ['quick-compare'] },
    { id: 'e-quick-swap-partition', source: 'quick-swap', target: 'quick-partition', smoothstep: true, activeSteps: ['quick-swap'] },
    { id: 'e-quick-partition-place', source: 'quick-partition', target: 'quick-place-pivot', activeSteps: ['quick-place-pivot'] },
    { id: 'e-quick-place-recurse', source: 'quick-place-pivot', target: 'quick-recurse', activeSteps: ['quick-place-pivot'] },
    { id: 'e-quick-recurse-pivot', source: 'quick-recurse', target: 'quick-pivot', smoothstep: true, activeSteps: ['quick-recurse'] },
    { id: 'e-quick-start-done', source: 'quick-start', target: 'quick-done', activeSteps: ['quick-done'] },
  ],
};

const SELECTION_SORT: FlowDefinition = {
  nodes: [
    { id: 'sel-start', label: 'Start' },
    { id: 'sel-outer', label: 'for i = 0 to n-1' },
    { id: 'sel-inner', label: 'min_idx = i; scan j' },
    { id: 'sel-compare', label: 'arr[j] < arr[min_idx]?', decision: true },
    { id: 'sel-update-min', label: 'min_idx = j' },
    { id: 'sel-swap', label: 'Swap arr[i], arr[min_idx]' },
    { id: 'sel-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-sel-start-outer', source: 'sel-start', target: 'sel-outer', activeSteps: ['sel-start'] },
    { id: 'e-sel-outer-inner', source: 'sel-outer', target: 'sel-inner', activeSteps: ['sel-outer'] },
    { id: 'e-sel-inner-compare', source: 'sel-inner', target: 'sel-compare', activeSteps: ['sel-inner'] },
    { id: 'e-sel-compare-update', source: 'sel-compare', target: 'sel-update-min', label: 'Yes', activeSteps: ['sel-compare', 'sel-update-min'] },
    { id: 'e-sel-compare-swap', source: 'sel-compare', target: 'sel-swap', label: 'No', activeSteps: ['sel-swap'] },
    { id: 'e-sel-update-inner', source: 'sel-update-min', target: 'sel-inner', smoothstep: true, activeSteps: ['sel-update-min'] },
    { id: 'e-sel-swap-outer', source: 'sel-swap', target: 'sel-outer', smoothstep: true, activeSteps: ['sel-swap'] },
    { id: 'e-sel-outer-done', source: 'sel-outer', target: 'sel-done', activeSteps: ['sel-done'] },
  ],
};

const HEAP_SORT: FlowDefinition = {
  nodes: [
    { id: 'heap-start', label: 'Start' },
    { id: 'heap-build', label: 'Build max heap' },
    { id: 'heap-swap', label: 'Swap root with end' },
    { id: 'heap-sift', label: 'Sift down' },
    { id: 'heap-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-heap-start-build', source: 'heap-start', target: 'heap-build', activeSteps: ['heap-start'] },
    { id: 'e-heap-build-swap', source: 'heap-build', target: 'heap-swap', activeSteps: ['heap-build'] },
    { id: 'e-heap-swap-sift', source: 'heap-swap', target: 'heap-sift', activeSteps: ['heap-swap'] },
    { id: 'e-heap-sift-swap', source: 'heap-sift', target: 'heap-swap', smoothstep: true, activeSteps: ['heap-sift'] },
    { id: 'e-heap-build-done', source: 'heap-build', target: 'heap-done', activeSteps: ['heap-done'] },
  ],
};

const COUNTING_SORT: FlowDefinition = {
  nodes: [
    { id: 'count-start', label: 'Start' },
    { id: 'count-count', label: 'Count frequencies' },
    { id: 'count-prefix', label: 'Prefix sum' },
    { id: 'count-place', label: 'Place in order' },
    { id: 'count-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-count-start-count', source: 'count-start', target: 'count-count', activeSteps: ['count-start'] },
    { id: 'e-count-count-prefix', source: 'count-count', target: 'count-prefix', activeSteps: ['count-count'] },
    { id: 'e-count-prefix-place', source: 'count-prefix', target: 'count-place', activeSteps: ['count-prefix', 'count-place'] },
    { id: 'e-count-place-done', source: 'count-place', target: 'count-done', activeSteps: ['count-done'] },
  ],
};

const RADIX_SORT: FlowDefinition = {
  nodes: [
    { id: 'radix-start', label: 'Start' },
    { id: 'radix-digit', label: 'Sort by digit' },
    { id: 'radix-bucket', label: 'Bucket by digit' },
    { id: 'radix-concat', label: 'Concat' },
    { id: 'radix-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-radix-start-digit', source: 'radix-start', target: 'radix-digit', activeSteps: ['radix-start'] },
    { id: 'e-radix-digit-bucket', source: 'radix-digit', target: 'radix-bucket', activeSteps: ['radix-digit'] },
    { id: 'e-radix-bucket-concat', source: 'radix-bucket', target: 'radix-concat', activeSteps: ['radix-bucket'] },
    { id: 'e-radix-concat-digit', source: 'radix-concat', target: 'radix-digit', smoothstep: true, activeSteps: ['radix-concat'] },
    { id: 'e-radix-digit-done', source: 'radix-digit', target: 'radix-done', activeSteps: ['radix-done'] },
  ],
};

const BUCKET_SORT: FlowDefinition = {
  nodes: [
    { id: 'bucket-start', label: 'Start' },
    { id: 'bucket-distribute', label: 'Distribute to buckets' },
    { id: 'bucket-sort', label: 'Sort each bucket' },
    { id: 'bucket-concat', label: 'Concat' },
    { id: 'bucket-done', label: 'Done' },
  ],
  edges: [
    { id: 'e-bucket-start-distribute', source: 'bucket-start', target: 'bucket-distribute', activeSteps: ['bucket-start'] },
    { id: 'e-bucket-distribute-sort', source: 'bucket-distribute', target: 'bucket-sort', activeSteps: ['bucket-distribute'] },
    { id: 'e-bucket-sort-concat', source: 'bucket-sort', target: 'bucket-concat', activeSteps: ['bucket-sort', 'bucket-concat'] },
    { id: 'e-bucket-concat-done', source: 'bucket-concat', target: 'bucket-done', activeSteps: ['bucket-done'] },
  ],
};

export const FLOW_DEFINITIONS: Record<DiagramVariant, FlowDefinition> = {
  'linear-search': LINEAR_SEARCH,
  'binary-search': BINARY_SEARCH,
  'insertion-sort': INSERTION_SORT,
  'merge-sort': MERGE_SORT,
  'bubble-sort': BUBBLE_SORT,
  'quick-sort': QUICK_SORT,
  'selection-sort': SELECTION_SORT,
  'heap-sort': HEAP_SORT,
  'counting-sort': COUNTING_SORT,
  'radix-sort': RADIX_SORT,
  'bucket-sort': BUCKET_SORT,
};
