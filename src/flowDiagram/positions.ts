import type { Algorithm } from '@/types/algorithms';

export type DiagramLayout = 'vertical' | 'horizontal';
export type DiagramVariant = Algorithm['id'];

export type PositionMap = Record<string, { x: number; y: number }>;

const VERTICAL_POSITIONS: PositionMap = {
  start: { x: 250, y: 0 },
  init: { x: 250, y: 100 },
  'check-length': { x: 220, y: 200 },
  compare: { x: 200, y: 320 },
  found: { x: 450, y: 320 },
  increment: { x: 50, y: 440 },
  'not-found': { x: 450, y: 200 },
};

const HORIZONTAL_POSITIONS: PositionMap = {
  start: { x: 0, y: 200 },
  init: { x: 260, y: 200 },
  'check-length': { x: 520, y: 200 },
  compare: { x: 780, y: 340 },
  found: { x: 1040, y: 200 },
  increment: { x: 780, y: 480 },
  'not-found': { x: 780, y: 60 },
};

const BINARY_VERTICAL_POSITIONS: PositionMap = {
  start: { x: 250, y: 0 },
  init: { x: 250, y: 80 },
  check: { x: 250, y: 160 },
  mid: { x: 250, y: 240 },
  compare: { x: 250, y: 320 },
  found: { x: 450, y: 320 },
  'go-left': { x: 80, y: 420 },
  'go-right': { x: 420, y: 420 },
  'not-found': { x: 450, y: 160 },
};

const BINARY_HORIZONTAL_POSITIONS: PositionMap = {
  start: { x: 0, y: 200 },
  init: { x: 200, y: 200 },
  check: { x: 400, y: 200 },
  mid: { x: 600, y: 200 },
  compare: { x: 800, y: 280 },
  found: { x: 1000, y: 120 },
  'go-left': { x: 680, y: 400 },
  'go-right': { x: 920, y: 400 },
  'not-found': { x: 400, y: 60 },
};

const INS_VERTICAL_POSITIONS: PositionMap = {
  start: { x: 250, y: 0 },
  'for-i': { x: 250, y: 60 },
  key: { x: 250, y: 120 },
  'while-j': { x: 250, y: 200 },
  'compare-sort': { x: 250, y: 280 },
  shift: { x: 80, y: 360 },
  'j-decrement': { x: 80, y: 440 },
  insert: { x: 420, y: 360 },
  'next-i': { x: 250, y: 480 },
  done: { x: 450, y: 200 },
};

const INS_HORIZONTAL_POSITIONS: PositionMap = {
  start: { x: 0, y: 200 },
  'for-i': { x: 180, y: 200 },
  key: { x: 360, y: 200 },
  'while-j': { x: 540, y: 200 },
  'compare-sort': { x: 720, y: 280 },
  shift: { x: 720, y: 400 },
  'j-decrement': { x: 600, y: 400 },
  insert: { x: 900, y: 120 },
  'next-i': { x: 360, y: 400 },
  done: { x: 900, y: 280 },
};

const SORT_VERTICAL: PositionMap = {
  start: { x: 250, y: 0 },
  'merge-start': { x: 250, y: 0 },
  'merge-divide': { x: 250, y: 60 },
  'merge-conquer': { x: 250, y: 120 },
  'merge-merge': { x: 250, y: 180 },
  'merge-compare': { x: 250, y: 240 },
  'merge-copy': { x: 80, y: 300 },
  'merge-copy-remaining': { x: 80, y: 360 },
  'merge-done': { x: 450, y: 120 },
  'bubble-start': { x: 250, y: 0 },
  'bubble-outer': { x: 250, y: 60 },
  'bubble-inner': { x: 250, y: 120 },
  'bubble-compare': { x: 250, y: 200 },
  'bubble-swap': { x: 80, y: 280 },
  'bubble-no-swap': { x: 420, y: 280 },
  'bubble-done': { x: 450, y: 120 },
  'quick-start': { x: 250, y: 0 },
  'quick-pivot': { x: 250, y: 60 },
  'quick-partition': { x: 250, y: 120 },
  'quick-compare': { x: 250, y: 200 },
  'quick-swap': { x: 80, y: 280 },
  'quick-place-pivot': { x: 250, y: 340 },
  'quick-recurse': { x: 250, y: 400 },
  'quick-done': { x: 450, y: 120 },
  'sel-start': { x: 250, y: 0 },
  'sel-outer': { x: 250, y: 60 },
  'sel-inner': { x: 250, y: 120 },
  'sel-compare': { x: 250, y: 200 },
  'sel-update-min': { x: 80, y: 280 },
  'sel-swap': { x: 250, y: 340 },
  'sel-done': { x: 450, y: 120 },
  'heap-start': { x: 250, y: 0 },
  'heap-build': { x: 250, y: 60 },
  'heap-swap': { x: 250, y: 140 },
  'heap-sift': { x: 250, y: 220 },
  'heap-done': { x: 450, y: 120 },
  'count-start': { x: 250, y: 0 },
  'count-count': { x: 250, y: 80 },
  'count-prefix': { x: 250, y: 160 },
  'count-place': { x: 250, y: 240 },
  'count-done': { x: 450, y: 120 },
  'radix-start': { x: 250, y: 0 },
  'radix-digit': { x: 250, y: 80 },
  'radix-bucket': { x: 250, y: 160 },
  'radix-concat': { x: 250, y: 240 },
  'radix-done': { x: 450, y: 120 },
  'bucket-start': { x: 250, y: 0 },
  'bucket-distribute': { x: 250, y: 80 },
  'bucket-sort': { x: 250, y: 160 },
  'bucket-concat': { x: 250, y: 240 },
  'bucket-done': { x: 450, y: 120 },
};

const VARIANTS_SORT_VERTICAL_ONLY: DiagramVariant[] = [
  'merge-sort', 'bubble-sort', 'quick-sort', 'selection-sort', 'heap-sort',
  'counting-sort', 'radix-sort', 'bucket-sort',
];

const POSITIONS_BY_VARIANT_LAYOUT: Partial<Record<DiagramVariant, Record<DiagramLayout, PositionMap>>> = {
  'linear-search': { vertical: VERTICAL_POSITIONS, horizontal: HORIZONTAL_POSITIONS },
  'binary-search': { vertical: BINARY_VERTICAL_POSITIONS, horizontal: BINARY_HORIZONTAL_POSITIONS },
  'insertion-sort': { vertical: INS_VERTICAL_POSITIONS, horizontal: INS_HORIZONTAL_POSITIONS },
};

export function getPositions(layout: DiagramLayout, variant: DiagramVariant): PositionMap {
  if (VARIANTS_SORT_VERTICAL_ONLY.includes(variant)) {
    return SORT_VERTICAL;
  }
  const byLayout = POSITIONS_BY_VARIANT_LAYOUT[variant];
  if (byLayout) {
    return byLayout[layout];
  }
  return layout === 'horizontal' ? HORIZONTAL_POSITIONS : VERTICAL_POSITIONS;
}
