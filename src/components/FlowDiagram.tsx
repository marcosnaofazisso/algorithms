import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store/theme';
import { Columns, Hand, Lock, LockOpen, Rows } from 'lucide-react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  Controls,
  ControlButton,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowStep } from '@/types/algorithms';

/** Height of the Diagram+Logs panel in px. The flow fills the space below the Diagram card header. */
export const FLOW_DIAGRAM_HEIGHT_PX = 360;

type DiagramLayout = 'vertical' | 'horizontal';
type DiagramVariant = 'linear-search' | 'binary-search' | 'insertion-sort' | 'merge-sort' | 'bubble-sort' | 'quick-sort' | 'selection-sort' | 'heap-sort' | 'counting-sort' | 'radix-sort' | 'bucket-sort';

const VERTICAL_POSITIONS: Record<string, { x: number; y: number }> = {
  start: { x: 250, y: 0 },
  init: { x: 250, y: 100 },
  'check-length': { x: 220, y: 200 },
  compare: { x: 200, y: 320 },
  found: { x: 450, y: 320 },
  increment: { x: 50, y: 440 },
  'not-found': { x: 450, y: 200 },
};

// Horizontal layout: generous spacing (260px x, 140px y) so edges are clearly visible
const HORIZONTAL_POSITIONS: Record<string, { x: number; y: number }> = {
  start: { x: 0, y: 200 },
  init: { x: 260, y: 200 },
  'check-length': { x: 520, y: 200 },
  compare: { x: 780, y: 340 },
  found: { x: 1040, y: 200 },
  increment: { x: 780, y: 480 },
  'not-found': { x: 780, y: 60 },
};

// Binary search: vertical
const BINARY_VERTICAL_POSITIONS: Record<string, { x: number; y: number }> = {
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

// Binary search: horizontal
const BINARY_HORIZONTAL_POSITIONS: Record<string, { x: number; y: number }> = {
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

// Insertion sort: vertical
const INS_VERTICAL_POSITIONS: Record<string, { x: number; y: number }> = {
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

// Insertion sort: horizontal
const INS_HORIZONTAL_POSITIONS: Record<string, { x: number; y: number }> = {
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

// Merge / Bubble / Quick: shared compact vertical
const SORT_VERTICAL: Record<string, { x: number; y: number }> = {
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

function getPositions(layout: DiagramLayout, variant: DiagramVariant): Record<string, { x: number; y: number }> {
  if (variant === 'binary-search') {
    return layout === 'horizontal' ? BINARY_HORIZONTAL_POSITIONS : BINARY_VERTICAL_POSITIONS;
  }
  if (variant === 'insertion-sort') {
    return layout === 'horizontal' ? INS_HORIZONTAL_POSITIONS : INS_VERTICAL_POSITIONS;
  }
  if (variant === 'merge-sort' || variant === 'bubble-sort' || variant === 'quick-sort' || variant === 'selection-sort' || variant === 'heap-sort' || variant === 'counting-sort' || variant === 'radix-sort' || variant === 'bucket-sort') {
    return SORT_VERTICAL;
  }
  return layout === 'horizontal' ? HORIZONTAL_POSITIONS : VERTICAL_POSITIONS;
}

interface FlowDiagramProps {
  currentStep: FlowStep;
  variant?: DiagramVariant;
  /** When true, nodes cannot be dragged (lock elements). */
  locked?: boolean;
  onLockToggle?: () => void;
}

function FlowDiagramInner({ currentStep, variant = 'linear-search', locked = true, onLockToggle }: FlowDiagramProps) {
  const [panEnabled, setPanEnabled] = useState(false);
  const [layout, setLayout] = useState<DiagramLayout>('vertical');
  const [theme] = useAtom(themeAtom);
  const isDark = theme === 'dark';
  const positions = getPositions(layout, variant);

  const activeBg = isDark ? '#E5E7EB' : '#000000';
  const activeFg = isDark ? '#000000' : '#FFFFFF';
  const inactiveBg = isDark ? '#374151' : '#FFFFFF';
  const inactiveFg = isDark ? '#E5E7EB' : '#000000';
  const inactiveBorder = isDark ? '#4B5563' : '#E5E7EB';
  const edgeActive = isDark ? '#E5E7EB' : '#000000';
  const edgeInactive = '#9CA3AF';
  const labelBg = isDark ? '#374151' : '#FFFFFF';

  const getNodeStyle = (_nodeId: FlowStep, isActive: boolean) => ({
    background: isActive ? activeBg : inactiveBg,
    color: isActive ? activeFg : inactiveFg,
    border: isActive ? `2px solid ${activeBg}` : `1px solid ${inactiveBorder}`,
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: '"Noto Serif", serif',
    minWidth: '120px',
    textAlign: 'center' as const,
    boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s',
  });

  const getDecisionNodeStyle = (_nodeId: FlowStep, isActive: boolean) => ({
    background: isActive ? activeBg : inactiveBg,
    color: isActive ? activeFg : inactiveFg,
    border: isActive ? `2px solid ${activeBg}` : `1px solid ${inactiveBorder}`,
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    fontFamily: '"Noto Serif", serif',
    width: '140px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s',
  });

  const initialNodes: Node[] = useMemo(() => {
    if (variant === 'binary-search') {
      return [
        { id: 'start', type: 'default', position: positions.start, data: { label: 'Start' }, style: getNodeStyle('start', currentStep === 'start') },
        { id: 'init', type: 'default', position: positions.init, data: { label: 'left=0, right=n-1' }, style: getNodeStyle('init', currentStep === 'init') },
        { id: 'check', type: 'default', position: positions.check, data: { label: 'left <= right?' }, style: getDecisionNodeStyle('check', currentStep === 'check') },
        { id: 'mid', type: 'default', position: positions.mid, data: { label: 'mid = (L+R)/2' }, style: getNodeStyle('mid', currentStep === 'mid') },
        { id: 'compare', type: 'default', position: positions.compare, data: { label: 'arr[mid] == target?' }, style: getDecisionNodeStyle('compare', currentStep === 'compare') },
        { id: 'found', type: 'default', position: positions.found, data: { label: 'Return mid' }, style: getNodeStyle('found', currentStep === 'found') },
        { id: 'go-left', type: 'default', position: positions['go-left'], data: { label: 'right = mid-1' }, style: getNodeStyle('go-left', currentStep === 'go-left') },
        { id: 'go-right', type: 'default', position: positions['go-right'], data: { label: 'left = mid+1' }, style: getNodeStyle('go-right', currentStep === 'go-right') },
        { id: 'not-found', type: 'default', position: positions['not-found'], data: { label: 'Return -1' }, style: getNodeStyle('not-found', currentStep === 'not-found') },
      ];
    }
    if (variant === 'insertion-sort') {
      return [
        { id: 'start', type: 'default', position: positions.start, data: { label: 'Start' }, style: getNodeStyle('start', currentStep === 'start') },
        { id: 'for-i', type: 'default', position: positions['for-i'], data: { label: 'for i = 1 to n-1' }, style: getDecisionNodeStyle('for-i', currentStep === 'for-i') },
        { id: 'key', type: 'default', position: positions.key, data: { label: 'key = arr[i]' }, style: getNodeStyle('key', currentStep === 'key') },
        { id: 'while-j', type: 'default', position: positions['while-j'], data: { label: 'j >= 0 and arr[j] > key?' }, style: getDecisionNodeStyle('while-j', currentStep === 'while-j') },
        { id: 'compare-sort', type: 'default', position: positions['compare-sort'], data: { label: 'arr[j] > key?' }, style: getDecisionNodeStyle('compare-sort', currentStep === 'compare-sort') },
        { id: 'shift', type: 'default', position: positions.shift, data: { label: 'arr[j+1] = arr[j]' }, style: getNodeStyle('shift', currentStep === 'shift') },
        { id: 'j-decrement', type: 'default', position: positions['j-decrement'], data: { label: 'j--' }, style: getNodeStyle('j-decrement', currentStep === 'j-decrement') },
        { id: 'insert', type: 'default', position: positions.insert, data: { label: 'arr[j+1] = key' }, style: getNodeStyle('insert', currentStep === 'insert') },
        { id: 'next-i', type: 'default', position: positions['next-i'], data: { label: 'next i' }, style: getNodeStyle('next-i', currentStep === 'next-i') },
        { id: 'done', type: 'default', position: positions.done, data: { label: 'Done' }, style: getNodeStyle('done', currentStep === 'done') },
      ];
    }
    if (variant === 'merge-sort') {
      return [
        { id: 'merge-start', type: 'default', position: positions['merge-start'], data: { label: 'Start' }, style: getNodeStyle('merge-start', currentStep === 'merge-start') },
        { id: 'merge-divide', type: 'default', position: positions['merge-divide'], data: { label: 'Size = 1, 2, 4...' }, style: getNodeStyle('merge-divide', currentStep === 'merge-divide') },
        { id: 'merge-conquer', type: 'default', position: positions['merge-conquer'], data: { label: 'Merge two runs' }, style: getNodeStyle('merge-conquer', currentStep === 'merge-conquer') },
        { id: 'merge-compare', type: 'default', position: positions['merge-compare'], data: { label: 'Compare left[i], right[j]' }, style: getDecisionNodeStyle('merge-compare', currentStep === 'merge-compare') },
        { id: 'merge-copy', type: 'default', position: positions['merge-copy'], data: { label: 'Copy smaller' }, style: getNodeStyle('merge-copy', currentStep === 'merge-copy') },
        { id: 'merge-copy-remaining', type: 'default', position: positions['merge-copy-remaining'], data: { label: 'Copy rest' }, style: getNodeStyle('merge-copy-remaining', currentStep === 'merge-copy-remaining') },
        { id: 'merge-done', type: 'default', position: positions['merge-done'], data: { label: 'Done' }, style: getNodeStyle('merge-done', currentStep === 'merge-done') },
      ];
    }
    if (variant === 'bubble-sort') {
      return [
        { id: 'bubble-start', type: 'default', position: positions['bubble-start'], data: { label: 'Start' }, style: getNodeStyle('bubble-start', currentStep === 'bubble-start') },
        { id: 'bubble-outer', type: 'default', position: positions['bubble-outer'], data: { label: 'for i = 0 to n-1' }, style: getNodeStyle('bubble-outer', currentStep === 'bubble-outer') },
        { id: 'bubble-inner', type: 'default', position: positions['bubble-inner'], data: { label: 'for j = 0 to n-1-i' }, style: getNodeStyle('bubble-inner', currentStep === 'bubble-inner') },
        { id: 'bubble-compare', type: 'default', position: positions['bubble-compare'], data: { label: 'arr[j] > arr[j+1]?' }, style: getDecisionNodeStyle('bubble-compare', currentStep === 'bubble-compare') },
        { id: 'bubble-swap', type: 'default', position: positions['bubble-swap'], data: { label: 'Swap' }, style: getNodeStyle('bubble-swap', currentStep === 'bubble-swap') },
        { id: 'bubble-no-swap', type: 'default', position: positions['bubble-no-swap'], data: { label: 'No swap' }, style: getNodeStyle('bubble-no-swap', currentStep === 'bubble-no-swap') },
        { id: 'bubble-done', type: 'default', position: positions['bubble-done'], data: { label: 'Done' }, style: getNodeStyle('bubble-done', currentStep === 'bubble-done') },
      ];
    }
    if (variant === 'quick-sort') {
      return [
        { id: 'quick-start', type: 'default', position: positions['quick-start'], data: { label: 'Start' }, style: getNodeStyle('quick-start', currentStep === 'quick-start') },
        { id: 'quick-pivot', type: 'default', position: positions['quick-pivot'], data: { label: 'Pivot = arr[high]' }, style: getNodeStyle('quick-pivot', currentStep === 'quick-pivot') },
        { id: 'quick-partition', type: 'default', position: positions['quick-partition'], data: { label: 'Partition [low..high]' }, style: getNodeStyle('quick-partition', currentStep === 'quick-partition') },
        { id: 'quick-compare', type: 'default', position: positions['quick-compare'], data: { label: 'arr[j] <= pivot?' }, style: getDecisionNodeStyle('quick-compare', currentStep === 'quick-compare') },
        { id: 'quick-swap', type: 'default', position: positions['quick-swap'], data: { label: 'Swap to left' }, style: getNodeStyle('quick-swap', currentStep === 'quick-swap') },
        { id: 'quick-place-pivot', type: 'default', position: positions['quick-place-pivot'], data: { label: 'Place pivot' }, style: getNodeStyle('quick-place-pivot', currentStep === 'quick-place-pivot') },
        { id: 'quick-recurse', type: 'default', position: positions['quick-recurse'], data: { label: 'Recurse left/right' }, style: getNodeStyle('quick-recurse', currentStep === 'quick-recurse') },
        { id: 'quick-done', type: 'default', position: positions['quick-done'], data: { label: 'Done' }, style: getNodeStyle('quick-done', currentStep === 'quick-done') },
      ];
    }
    if (variant === 'selection-sort') {
      return [
        { id: 'sel-start', type: 'default', position: positions['sel-start'], data: { label: 'Start' }, style: getNodeStyle('sel-start', currentStep === 'sel-start') },
        { id: 'sel-outer', type: 'default', position: positions['sel-outer'], data: { label: 'for i = 0 to n-1' }, style: getNodeStyle('sel-outer', currentStep === 'sel-outer') },
        { id: 'sel-inner', type: 'default', position: positions['sel-inner'], data: { label: 'min_idx = i; scan j' }, style: getNodeStyle('sel-inner', currentStep === 'sel-inner') },
        { id: 'sel-compare', type: 'default', position: positions['sel-compare'], data: { label: 'arr[j] < arr[min_idx]?' }, style: getDecisionNodeStyle('sel-compare', currentStep === 'sel-compare') },
        { id: 'sel-update-min', type: 'default', position: positions['sel-update-min'], data: { label: 'min_idx = j' }, style: getNodeStyle('sel-update-min', currentStep === 'sel-update-min') },
        { id: 'sel-swap', type: 'default', position: positions['sel-swap'], data: { label: 'Swap arr[i], arr[min_idx]' }, style: getNodeStyle('sel-swap', currentStep === 'sel-swap') },
        { id: 'sel-done', type: 'default', position: positions['sel-done'], data: { label: 'Done' }, style: getNodeStyle('sel-done', currentStep === 'sel-done') },
      ];
    }
    if (variant === 'heap-sort') {
      return [
        { id: 'heap-start', type: 'default', position: positions['heap-start'], data: { label: 'Start' }, style: getNodeStyle('heap-start', currentStep === 'heap-start') },
        { id: 'heap-build', type: 'default', position: positions['heap-build'], data: { label: 'Build max heap' }, style: getNodeStyle('heap-build', currentStep === 'heap-build') },
        { id: 'heap-swap', type: 'default', position: positions['heap-swap'], data: { label: 'Swap root with end' }, style: getNodeStyle('heap-swap', currentStep === 'heap-swap') },
        { id: 'heap-sift', type: 'default', position: positions['heap-sift'], data: { label: 'Sift down' }, style: getNodeStyle('heap-sift', currentStep === 'heap-sift') },
        { id: 'heap-done', type: 'default', position: positions['heap-done'], data: { label: 'Done' }, style: getNodeStyle('heap-done', currentStep === 'heap-done') },
      ];
    }
    if (variant === 'counting-sort') {
      return [
        { id: 'count-start', type: 'default', position: positions['count-start'], data: { label: 'Start' }, style: getNodeStyle('count-start', currentStep === 'count-start') },
        { id: 'count-count', type: 'default', position: positions['count-count'], data: { label: 'Count frequencies' }, style: getNodeStyle('count-count', currentStep === 'count-count') },
        { id: 'count-prefix', type: 'default', position: positions['count-prefix'], data: { label: 'Prefix sum' }, style: getNodeStyle('count-prefix', currentStep === 'count-prefix') },
        { id: 'count-place', type: 'default', position: positions['count-place'], data: { label: 'Place in order' }, style: getNodeStyle('count-place', currentStep === 'count-place') },
        { id: 'count-done', type: 'default', position: positions['count-done'], data: { label: 'Done' }, style: getNodeStyle('count-done', currentStep === 'count-done') },
      ];
    }
    if (variant === 'radix-sort') {
      return [
        { id: 'radix-start', type: 'default', position: positions['radix-start'], data: { label: 'Start' }, style: getNodeStyle('radix-start', currentStep === 'radix-start') },
        { id: 'radix-digit', type: 'default', position: positions['radix-digit'], data: { label: 'Sort by digit' }, style: getNodeStyle('radix-digit', currentStep === 'radix-digit') },
        { id: 'radix-bucket', type: 'default', position: positions['radix-bucket'], data: { label: 'Bucket by digit' }, style: getNodeStyle('radix-bucket', currentStep === 'radix-bucket') },
        { id: 'radix-concat', type: 'default', position: positions['radix-concat'], data: { label: 'Concat' }, style: getNodeStyle('radix-concat', currentStep === 'radix-concat') },
        { id: 'radix-done', type: 'default', position: positions['radix-done'], data: { label: 'Done' }, style: getNodeStyle('radix-done', currentStep === 'radix-done') },
      ];
    }
    if (variant === 'bucket-sort') {
      return [
        { id: 'bucket-start', type: 'default', position: positions['bucket-start'], data: { label: 'Start' }, style: getNodeStyle('bucket-start', currentStep === 'bucket-start') },
        { id: 'bucket-distribute', type: 'default', position: positions['bucket-distribute'], data: { label: 'Distribute to buckets' }, style: getNodeStyle('bucket-distribute', currentStep === 'bucket-distribute') },
        { id: 'bucket-sort', type: 'default', position: positions['bucket-sort'], data: { label: 'Sort each bucket' }, style: getNodeStyle('bucket-sort', currentStep === 'bucket-sort') },
        { id: 'bucket-concat', type: 'default', position: positions['bucket-concat'], data: { label: 'Concat' }, style: getNodeStyle('bucket-concat', currentStep === 'bucket-concat') },
        { id: 'bucket-done', type: 'default', position: positions['bucket-done'], data: { label: 'Done' }, style: getNodeStyle('bucket-done', currentStep === 'bucket-done') },
      ];
    }
    return [
      { id: 'start', type: 'default', position: positions.start, data: { label: 'Start' }, style: getNodeStyle('start', currentStep === 'start') },
      { id: 'init', type: 'default', position: positions.init, data: { label: 'i = 0' }, style: getNodeStyle('init', currentStep === 'init') },
      { id: 'check-length', type: 'default', position: positions['check-length'], data: { label: 'i < length?' }, style: getDecisionNodeStyle('check-length', currentStep === 'check-length') },
      { id: 'compare', type: 'default', position: positions.compare, data: { label: 'arr[i] == target?' }, style: getDecisionNodeStyle('compare', currentStep === 'compare') },
      { id: 'found', type: 'default', position: positions.found, data: { label: 'Return i' }, style: getNodeStyle('found', currentStep === 'found') },
      { id: 'increment', type: 'default', position: positions.increment, data: { label: 'i++' }, style: getNodeStyle('increment', currentStep === 'increment') },
      { id: 'not-found', type: 'default', position: positions['not-found'], data: { label: 'Return -1' }, style: getNodeStyle('not-found', currentStep === 'not-found') },
    ];
  }, [currentStep, layout, variant, isDark, positions]);

  const initialEdges: Edge[] = useMemo(() => {
    if (variant === 'binary-search') {
      return [
        { id: 'e-start-init', source: 'start', target: 'init', style: { stroke: currentStep === 'start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'start' ? 2.5 : 1.5 }, animated: currentStep === 'start' },
        { id: 'e-init-check', source: 'init', target: 'check', style: { stroke: currentStep === 'init' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'init' ? 2.5 : 1.5 }, animated: currentStep === 'init' },
        { id: 'e-check-mid', source: 'check', target: 'mid', label: 'Yes', style: { stroke: currentStep === 'check' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'check' ? 2.5 : 1.5 }, animated: currentStep === 'check', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-check-notfound', source: 'check', target: 'not-found', label: 'No', style: { stroke: currentStep === 'not-found' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'not-found' ? 2.5 : 1.5 }, animated: currentStep === 'not-found', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-mid-compare', source: 'mid', target: 'compare', style: { stroke: currentStep === 'mid' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'mid' ? 2.5 : 1.5 }, animated: currentStep === 'mid' },
        { id: 'e-compare-found', source: 'compare', target: 'found', label: 'Yes', style: { stroke: currentStep === 'compare' || currentStep === 'found' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'compare' || currentStep === 'found' ? 2.5 : 1.5 }, animated: currentStep === 'compare' || currentStep === 'found', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-compare-goleft', source: 'compare', target: 'go-left', label: 'No, >', style: { stroke: currentStep === 'go-left' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'go-left' ? 2.5 : 1.5 }, animated: currentStep === 'go-left', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-compare-goright', source: 'compare', target: 'go-right', label: 'No, <', style: { stroke: currentStep === 'go-right' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'go-right' ? 2.5 : 1.5 }, animated: currentStep === 'go-right', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-goleft-check', source: 'go-left', target: 'check', style: { stroke: edgeInactive, strokeWidth: 1.5 }, type: 'smoothstep', animated: false },
        { id: 'e-goright-check', source: 'go-right', target: 'check', style: { stroke: edgeInactive, strokeWidth: 1.5 }, type: 'smoothstep', animated: false },
      ];
    }
    if (variant === 'insertion-sort') {
      return [
        { id: 'e-start-fori', source: 'start', target: 'for-i', style: { stroke: currentStep === 'start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'start' ? 2.5 : 1.5 }, animated: currentStep === 'start' },
        { id: 'e-fori-key', source: 'for-i', target: 'key', label: 'Yes', style: { stroke: currentStep === 'for-i' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'for-i' ? 2.5 : 1.5 }, animated: currentStep === 'for-i', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-fori-done', source: 'for-i', target: 'done', label: 'No', style: { stroke: currentStep === 'done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'done' ? 2.5 : 1.5 }, animated: currentStep === 'done', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-key-whilej', source: 'key', target: 'while-j', style: { stroke: currentStep === 'key' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'key' ? 2.5 : 1.5 }, animated: currentStep === 'key' },
        { id: 'e-whilej-compare', source: 'while-j', target: 'compare-sort', label: 'Yes', style: { stroke: currentStep === 'while-j' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'while-j' ? 2.5 : 1.5 }, animated: currentStep === 'while-j', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-whilej-insert', source: 'while-j', target: 'insert', label: 'No', style: { stroke: currentStep === 'insert' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'insert' ? 2.5 : 1.5 }, animated: currentStep === 'insert', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-compare-shift', source: 'compare-sort', target: 'shift', style: { stroke: currentStep === 'compare-sort' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'compare-sort' ? 2.5 : 1.5 }, animated: currentStep === 'compare-sort' },
        { id: 'e-shift-jdec', source: 'shift', target: 'j-decrement', style: { stroke: currentStep === 'shift' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'shift' ? 2.5 : 1.5 }, animated: currentStep === 'shift' },
        { id: 'e-jdec-whilej', source: 'j-decrement', target: 'while-j', style: { stroke: currentStep === 'j-decrement' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'j-decrement' ? 2.5 : 1.5 }, animated: currentStep === 'j-decrement', type: 'smoothstep' },
        { id: 'e-insert-nexti', source: 'insert', target: 'next-i', style: { stroke: currentStep === 'insert' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'insert' ? 2.5 : 1.5 }, animated: currentStep === 'insert' },
        { id: 'e-nexti-fori', source: 'next-i', target: 'for-i', style: { stroke: currentStep === 'next-i' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'next-i' ? 2.5 : 1.5 }, animated: currentStep === 'next-i', type: 'smoothstep' },
      ];
    }
    if (variant === 'merge-sort') {
      return [
        { id: 'e-merge-start-divide', source: 'merge-start', target: 'merge-divide', style: { stroke: currentStep === 'merge-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-start' ? 2.5 : 1.5 }, animated: currentStep === 'merge-start' },
        { id: 'e-merge-divide-conquer', source: 'merge-divide', target: 'merge-conquer', style: { stroke: currentStep === 'merge-divide' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-divide' ? 2.5 : 1.5 }, animated: currentStep === 'merge-divide' },
        { id: 'e-merge-conquer-compare', source: 'merge-conquer', target: 'merge-compare', style: { stroke: currentStep === 'merge-conquer' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-conquer' ? 2.5 : 1.5 }, animated: currentStep === 'merge-conquer' },
        { id: 'e-merge-compare-copy', source: 'merge-compare', target: 'merge-copy', style: { stroke: currentStep === 'merge-compare' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-compare' ? 2.5 : 1.5 }, animated: currentStep === 'merge-compare' },
        { id: 'e-merge-copy-remaining', source: 'merge-copy', target: 'merge-copy-remaining', style: { stroke: currentStep === 'merge-copy' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-copy' ? 2.5 : 1.5 }, animated: currentStep === 'merge-copy' },
        { id: 'e-merge-remaining-conquer', source: 'merge-copy-remaining', target: 'merge-conquer', style: { stroke: currentStep === 'merge-copy-remaining' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-copy-remaining' ? 2.5 : 1.5 }, animated: currentStep === 'merge-copy-remaining', type: 'smoothstep' },
        { id: 'e-merge-divide-done', source: 'merge-divide', target: 'merge-done', style: { stroke: currentStep === 'merge-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'merge-done' ? 2.5 : 1.5 }, animated: currentStep === 'merge-done' },
      ];
    }
    if (variant === 'bubble-sort') {
      return [
        { id: 'e-bubble-start-outer', source: 'bubble-start', target: 'bubble-outer', style: { stroke: currentStep === 'bubble-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-start' ? 2.5 : 1.5 }, animated: currentStep === 'bubble-start' },
        { id: 'e-bubble-outer-inner', source: 'bubble-outer', target: 'bubble-inner', style: { stroke: currentStep === 'bubble-outer' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-outer' ? 2.5 : 1.5 }, animated: currentStep === 'bubble-outer' },
        { id: 'e-bubble-inner-compare', source: 'bubble-inner', target: 'bubble-compare', style: { stroke: currentStep === 'bubble-inner' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-inner' ? 2.5 : 1.5 }, animated: currentStep === 'bubble-inner' },
        { id: 'e-bubble-compare-swap', source: 'bubble-compare', target: 'bubble-swap', label: 'Yes', style: { stroke: currentStep === 'bubble-compare' || currentStep === 'bubble-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-compare' || currentStep === 'bubble-swap' ? 2.5 : 1.5 }, animated: currentStep === 'bubble-compare' || currentStep === 'bubble-swap', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-bubble-compare-noswap', source: 'bubble-compare', target: 'bubble-no-swap', label: 'No', style: { stroke: currentStep === 'bubble-no-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-no-swap' ? 2.5 : 1.5 }, animated: currentStep === 'bubble-no-swap', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-bubble-swap-inner', source: 'bubble-swap', target: 'bubble-inner', style: { stroke: currentStep === 'bubble-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-swap' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'bubble-swap' },
        { id: 'e-bubble-noswap-inner', source: 'bubble-no-swap', target: 'bubble-inner', style: { stroke: currentStep === 'bubble-no-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-no-swap' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'bubble-no-swap' },
        { id: 'e-bubble-outer-done', source: 'bubble-outer', target: 'bubble-done', style: { stroke: currentStep === 'bubble-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bubble-done' ? 2.5 : 1.5 }, animated: currentStep === 'bubble-done' },
      ];
    }
    if (variant === 'quick-sort') {
      return [
        { id: 'e-quick-start-pivot', source: 'quick-start', target: 'quick-pivot', style: { stroke: currentStep === 'quick-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-start' ? 2.5 : 1.5 }, animated: currentStep === 'quick-start' },
        { id: 'e-quick-pivot-partition', source: 'quick-pivot', target: 'quick-partition', style: { stroke: currentStep === 'quick-pivot' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-pivot' ? 2.5 : 1.5 }, animated: currentStep === 'quick-pivot' },
        { id: 'e-quick-partition-compare', source: 'quick-partition', target: 'quick-compare', style: { stroke: currentStep === 'quick-partition' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-partition' ? 2.5 : 1.5 }, animated: currentStep === 'quick-partition' },
        { id: 'e-quick-compare-swap', source: 'quick-compare', target: 'quick-swap', label: 'Yes', style: { stroke: currentStep === 'quick-compare' || currentStep === 'quick-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-compare' || currentStep === 'quick-swap' ? 2.5 : 1.5 }, animated: currentStep === 'quick-compare' || currentStep === 'quick-swap', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-quick-compare-partition', source: 'quick-compare', target: 'quick-partition', label: 'No', style: { stroke: currentStep === 'quick-compare' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-compare' ? 2.5 : 1.5 }, animated: currentStep === 'quick-compare', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-quick-swap-partition', source: 'quick-swap', target: 'quick-partition', style: { stroke: currentStep === 'quick-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-swap' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'quick-swap' },
        { id: 'e-quick-partition-place', source: 'quick-partition', target: 'quick-place-pivot', style: { stroke: currentStep === 'quick-place-pivot' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-place-pivot' ? 2.5 : 1.5 }, animated: currentStep === 'quick-place-pivot' },
        { id: 'e-quick-place-recurse', source: 'quick-place-pivot', target: 'quick-recurse', style: { stroke: currentStep === 'quick-place-pivot' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-place-pivot' ? 2.5 : 1.5 }, animated: currentStep === 'quick-place-pivot' },
        { id: 'e-quick-recurse-pivot', source: 'quick-recurse', target: 'quick-pivot', style: { stroke: currentStep === 'quick-recurse' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-recurse' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'quick-recurse' },
        { id: 'e-quick-start-done', source: 'quick-start', target: 'quick-done', style: { stroke: currentStep === 'quick-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'quick-done' ? 2.5 : 1.5 }, animated: currentStep === 'quick-done' },
      ];
    }
    if (variant === 'selection-sort') {
      return [
        { id: 'e-sel-start-outer', source: 'sel-start', target: 'sel-outer', style: { stroke: currentStep === 'sel-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-start' ? 2.5 : 1.5 }, animated: currentStep === 'sel-start' },
        { id: 'e-sel-outer-inner', source: 'sel-outer', target: 'sel-inner', style: { stroke: currentStep === 'sel-outer' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-outer' ? 2.5 : 1.5 }, animated: currentStep === 'sel-outer' },
        { id: 'e-sel-inner-compare', source: 'sel-inner', target: 'sel-compare', style: { stroke: currentStep === 'sel-inner' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-inner' ? 2.5 : 1.5 }, animated: currentStep === 'sel-inner' },
        { id: 'e-sel-compare-update', source: 'sel-compare', target: 'sel-update-min', label: 'Yes', style: { stroke: currentStep === 'sel-compare' || currentStep === 'sel-update-min' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-compare' || currentStep === 'sel-update-min' ? 2.5 : 1.5 }, animated: currentStep === 'sel-compare' || currentStep === 'sel-update-min', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-sel-compare-swap', source: 'sel-compare', target: 'sel-swap', label: 'No', style: { stroke: currentStep === 'sel-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-swap' ? 2.5 : 1.5 }, animated: currentStep === 'sel-swap', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
        { id: 'e-sel-update-inner', source: 'sel-update-min', target: 'sel-inner', style: { stroke: currentStep === 'sel-update-min' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-update-min' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'sel-update-min' },
        { id: 'e-sel-swap-outer', source: 'sel-swap', target: 'sel-outer', style: { stroke: currentStep === 'sel-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-swap' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'sel-swap' },
        { id: 'e-sel-outer-done', source: 'sel-outer', target: 'sel-done', style: { stroke: currentStep === 'sel-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'sel-done' ? 2.5 : 1.5 }, animated: currentStep === 'sel-done' },
      ];
    }
    if (variant === 'heap-sort') {
      return [
        { id: 'e-heap-start-build', source: 'heap-start', target: 'heap-build', style: { stroke: currentStep === 'heap-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'heap-start' ? 2.5 : 1.5 }, animated: currentStep === 'heap-start' },
        { id: 'e-heap-build-swap', source: 'heap-build', target: 'heap-swap', style: { stroke: currentStep === 'heap-build' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'heap-build' ? 2.5 : 1.5 }, animated: currentStep === 'heap-build' },
        { id: 'e-heap-swap-sift', source: 'heap-swap', target: 'heap-sift', style: { stroke: currentStep === 'heap-swap' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'heap-swap' ? 2.5 : 1.5 }, animated: currentStep === 'heap-swap' },
        { id: 'e-heap-sift-swap', source: 'heap-sift', target: 'heap-swap', style: { stroke: currentStep === 'heap-sift' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'heap-sift' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'heap-sift' },
        { id: 'e-heap-build-done', source: 'heap-build', target: 'heap-done', style: { stroke: currentStep === 'heap-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'heap-done' ? 2.5 : 1.5 }, animated: currentStep === 'heap-done' },
      ];
    }
    if (variant === 'counting-sort') {
      return [
        { id: 'e-count-start-count', source: 'count-start', target: 'count-count', style: { stroke: currentStep === 'count-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'count-start' ? 2.5 : 1.5 }, animated: currentStep === 'count-start' },
        { id: 'e-count-count-prefix', source: 'count-count', target: 'count-prefix', style: { stroke: currentStep === 'count-count' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'count-count' ? 2.5 : 1.5 }, animated: currentStep === 'count-count' },
        { id: 'e-count-prefix-place', source: 'count-prefix', target: 'count-place', style: { stroke: currentStep === 'count-prefix' || currentStep === 'count-place' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'count-prefix' || currentStep === 'count-place' ? 2.5 : 1.5 }, animated: currentStep === 'count-prefix' || currentStep === 'count-place' },
        { id: 'e-count-place-done', source: 'count-place', target: 'count-done', style: { stroke: currentStep === 'count-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'count-done' ? 2.5 : 1.5 }, animated: currentStep === 'count-done' },
      ];
    }
    if (variant === 'radix-sort') {
      return [
        { id: 'e-radix-start-digit', source: 'radix-start', target: 'radix-digit', style: { stroke: currentStep === 'radix-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'radix-start' ? 2.5 : 1.5 }, animated: currentStep === 'radix-start' },
        { id: 'e-radix-digit-bucket', source: 'radix-digit', target: 'radix-bucket', style: { stroke: currentStep === 'radix-digit' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'radix-digit' ? 2.5 : 1.5 }, animated: currentStep === 'radix-digit' },
        { id: 'e-radix-bucket-concat', source: 'radix-bucket', target: 'radix-concat', style: { stroke: currentStep === 'radix-bucket' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'radix-bucket' ? 2.5 : 1.5 }, animated: currentStep === 'radix-bucket' },
        { id: 'e-radix-concat-digit', source: 'radix-concat', target: 'radix-digit', style: { stroke: currentStep === 'radix-concat' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'radix-concat' ? 2.5 : 1.5 }, type: 'smoothstep', animated: currentStep === 'radix-concat' },
        { id: 'e-radix-digit-done', source: 'radix-digit', target: 'radix-done', style: { stroke: currentStep === 'radix-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'radix-done' ? 2.5 : 1.5 }, animated: currentStep === 'radix-done' },
      ];
    }
    if (variant === 'bucket-sort') {
      return [
        { id: 'e-bucket-start-distribute', source: 'bucket-start', target: 'bucket-distribute', style: { stroke: currentStep === 'bucket-start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bucket-start' ? 2.5 : 1.5 }, animated: currentStep === 'bucket-start' },
        { id: 'e-bucket-distribute-sort', source: 'bucket-distribute', target: 'bucket-sort', style: { stroke: currentStep === 'bucket-distribute' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bucket-distribute' ? 2.5 : 1.5 }, animated: currentStep === 'bucket-distribute' },
        { id: 'e-bucket-sort-concat', source: 'bucket-sort', target: 'bucket-concat', style: { stroke: currentStep === 'bucket-sort' || currentStep === 'bucket-concat' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bucket-sort' || currentStep === 'bucket-concat' ? 2.5 : 1.5 }, animated: currentStep === 'bucket-sort' || currentStep === 'bucket-concat' },
        { id: 'e-bucket-concat-done', source: 'bucket-concat', target: 'bucket-done', style: { stroke: currentStep === 'bucket-done' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'bucket-done' ? 2.5 : 1.5 }, animated: currentStep === 'bucket-done' },
      ];
    }
    return [
      { id: 'e-start-init', source: 'start', target: 'init', style: { stroke: currentStep === 'start' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'start' ? 2.5 : 1.5 }, animated: currentStep === 'start' },
      { id: 'e-init-check', source: 'init', target: 'check-length', style: { stroke: currentStep === 'init' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'init' ? 2.5 : 1.5 }, animated: currentStep === 'init' },
      { id: 'e-check-compare', source: 'check-length', target: 'compare', label: 'Yes', style: { stroke: currentStep === 'check-length' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'check-length' ? 2.5 : 1.5 }, animated: currentStep === 'check-length', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-check-notfound', source: 'check-length', target: 'not-found', label: 'No', style: { stroke: edgeInactive, strokeWidth: 1.5 }, animated: false, labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-compare-found', source: 'compare', target: 'found', label: 'Yes', style: { stroke: currentStep === 'compare' || currentStep === 'found' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'compare' || currentStep === 'found' ? 2.5 : 1.5 }, animated: currentStep === 'compare' || currentStep === 'found', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-compare-increment', source: 'compare', target: 'increment', label: 'No', style: { stroke: currentStep === 'increment' ? edgeActive : edgeInactive, strokeWidth: currentStep === 'increment' ? 2.5 : 1.5 }, animated: currentStep === 'increment', labelStyle: { fontFamily: '"Noto Serif", serif', fontSize: '12px' }, labelBgStyle: { fill: labelBg } },
      { id: 'e-increment-check', source: 'increment', target: 'check-length', style: { stroke: edgeInactive, strokeWidth: 1.5 }, type: 'smoothstep', animated: false },
    ];
  }, [currentStep, variant, isDark, labelBg, edgeActive, edgeInactive]);

  const togglePan = () => setPanEnabled((p) => !p);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow();

  // On step change: only update styles (and edge styles), preserve node positions so user drags are kept
  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const fromInitial = initialNodes.find((n) => n.id === node.id);
        return fromInitial ? { ...node, style: fromInitial.style, data: fromInitial.data } : node;
      })
    );
    setEdges((current) =>
      current.map((edge) => {
        const fromInitial = initialEdges.find((e) => e.id === edge.id);
        return fromInitial
          ? {
              ...edge,
              style: fromInitial.style,
              animated: fromInitial.animated,
              label: fromInitial.label,
              labelStyle: fromInitial.labelStyle,
              labelBgStyle: fromInitial.labelBgStyle,
            }
          : edge;
      })
    );
  }, [currentStep, initialNodes, initialEdges, setNodes, setEdges]);

  // Default view: fit on mount
  useEffect(() => {
    fitView({ padding: 0.3, maxZoom: 1, duration: 0 });
  }, [fitView]);

  // When layout or variant changes: update node positions and fit view so edges remain visible
  useEffect(() => {
    const pos = getPositions(layout, variant);
    setNodes((nds) => nds.map((n) => ({ ...n, position: pos[n.id] ?? n.position })));
    const t = setTimeout(() => fitView({ padding: 0.25, maxZoom: 1, duration: 300 }), 0);
    return () => clearTimeout(t);
  }, [layout, variant, setNodes, fitView]);

  return (
    <div className="w-full h-full min-h-0 border border-gray-200 dark:border-gray-500 rounded-lg overflow-hidden bg-white dark:bg-[#0f1117]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1, duration: 0 }}
        attributionPosition="bottom-left"
        nodesDraggable={!locked}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={panEnabled}
        panOnScroll={panEnabled}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        minZoom={0.5}
        maxZoom={1.5}
        style={{ width: '100%', height: '100%' }}
      >
        <Background color={isDark ? '#4B5563' : '#E5E7EB'} gap={16} size={1} />
        <Controls position="bottom-left" showInteractive={false}>
          <ControlButton
            onClick={() => setLayout((l) => (l === 'vertical' ? 'horizontal' : 'vertical'))}
            title={layout === 'vertical' ? 'Switch to horizontal layout' : 'Switch to vertical layout'}
            style={{ background: layout === 'horizontal' ? 'rgba(0,0,0,0.06)' : undefined }}
          >
            {layout === 'vertical' ? <Columns className="size-4" /> : <Rows className="size-4" />}
          </ControlButton>
          <ControlButton
            onClick={togglePan}
            title={panEnabled ? 'Pan on (click to disable)' : 'Pan off (click to enable)'}
            style={{ background: panEnabled ? undefined : 'rgba(0,0,0,0.05)' }}
          >
            <Hand className="size-4" />
          </ControlButton>
          {onLockToggle && (
            <ControlButton
              onClick={onLockToggle}
              title={locked ? 'Unlock to move elements' : 'Lock elements'}
            >
              {locked ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
            </ControlButton>
          )}
        </Controls>
      </ReactFlow>
    </div>
  );
}

export default function FlowDiagram({ currentStep, variant = 'linear-search', locked = true, onLockToggle }: FlowDiagramProps) {
  return (
    <ReactFlowProvider initialWidth={800} initialHeight={FLOW_DIAGRAM_HEIGHT_PX} fitView>
      <FlowDiagramInner currentStep={currentStep} variant={variant} locked={locked} onLockToggle={onLockToggle} />
    </ReactFlowProvider>
  );
}
