import type { ComponentType } from 'react';
import type { Algorithm } from '@/types/algorithms';
import LinearSearchViz from '@/components/LinearSearchViz';
import BinarySearchViz from '@/components/BinarySearchViz';
import InsertionSortViz from '@/components/InsertionSortViz';
import MergeSortViz from '@/components/MergeSortViz';
import BubbleSortViz from '@/components/BubbleSortViz';
import QuickSortViz from '@/components/QuickSortViz';
import SelectionSortViz from '@/components/SelectionSortViz';
import HeapSortViz from '@/components/HeapSortViz';
import CountingSortViz from '@/components/CountingSortViz';
import RadixSortViz from '@/components/RadixSortViz';
import BucketSortViz from '@/components/BucketSortViz';
import BinaryTreeViz from '@/components/BinaryTreeViz';

export interface AlgorithmVizProps {
  algorithm: Algorithm;
}

export const algorithmVizRegistry: Record<string, ComponentType<AlgorithmVizProps>> = {
  'linear-search': LinearSearchViz,
  'binary-search': BinarySearchViz,
  'insertion-sort': InsertionSortViz,
  'merge-sort': MergeSortViz,
  'bubble-sort': BubbleSortViz,
  'quick-sort': QuickSortViz,
  'selection-sort': SelectionSortViz,
  'heap-sort': HeapSortViz,
  'counting-sort': CountingSortViz,
  'radix-sort': RadixSortViz,
  'bucket-sort': BucketSortViz,
  'binary-tree': BinaryTreeViz,
};

export function getVizComponent(algorithmId: string | undefined): ComponentType<AlgorithmVizProps> | null {
  if (!algorithmId) return null;
  return algorithmVizRegistry[algorithmId] ?? null;
}
