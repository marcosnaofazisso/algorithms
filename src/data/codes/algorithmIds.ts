export const ALGORITHM_IDS = [
  'linear-search',
  'binary-search',
  'insertion-sort',
  'merge-sort',
  'bubble-sort',
  'quick-sort',
  'selection-sort',
  'heap-sort',
  'counting-sort',
  'radix-sort',
  'bucket-sort',
  'binary-tree',
] as const;

export type AlgorithmId = (typeof ALGORITHM_IDS)[number];
