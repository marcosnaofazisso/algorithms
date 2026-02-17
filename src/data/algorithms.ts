import type { Algorithm } from '@/types/algorithms';
import { PYTHON_CODE } from './codes/python';
import { JAVA_CODE } from './codes/java';
import { CSHARP_CODE } from './codes/csharp';
import { PHP_CODE } from './codes/php';
import { NODE_CODE } from './codes/node';
import { GO_CODE } from './codes/go';
import { RUST_CODE } from './codes/rust';

function codeFor(id: keyof typeof PYTHON_CODE) {
  return {
    python: PYTHON_CODE[id],
    java: JAVA_CODE[id],
    csharp: CSHARP_CODE[id],
    php: PHP_CODE[id],
    node: NODE_CODE[id],
    go: GO_CODE[id],
    rust: RUST_CODE[id],
  };
}

export const algorithms: Algorithm[] = [
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'search',
    description:
      'A search algorithm that sequentially checks each element in a list until it finds the target or reaches the end. It is the simplest search method and works on any list, sorted or not.',
    whatFor:
      'Linear search is used to find whether a value exists in a collection (array, list) and, if so, at which index. It is the go-to when the data is unsorted or when you need to find a single occurrence.',
    bestUseCase:
      'Best for small or unsorted data. It is ideal when you rarely search (so sorting would not pay off), when the list is small (e.g. under a few dozen elements), or when you need a simple, correct implementation without extra memory. It also works when the list is already sorted but you do not want to maintain a more complex structure.',
    performance:
      'It is simple but not fast on large data: in the worst case it checks every element (O(n)). It can be fast when the target is near the start (best case O(1)). There is no extra memory beyond a few variables (O(1) space). For large or frequently searched data, consider binary search (on sorted data) or a hash set for lookups.',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n)',
    spaceComplexity: 'O(1)',
    code: codeFor('linear-search'),
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'search',
    description:
      'A search algorithm that repeatedly divides the sorted array in half, comparing the middle element with the target. It only works on sorted data and achieves O(log n) time in the worst case.',
    whatFor:
      'Binary search is used to find whether a value exists in a sorted collection and at which index. It is the standard choice when the data is sorted and you need fast lookups.',
    bestUseCase:
      'Best for sorted arrays or when you can afford to keep data sorted. Ideal for large datasets where linear search would be too slow, and when you need to find a single occurrence or the insertion point.',
    performance:
      'Requires sorted input. Worst and average case are O(log n) comparisons. Best case O(1) when the middle element is the target. Space is O(1) for the iterative version. For unsorted data, sort first or use linear search.',
    bestCase: 'O(1)',
    averageCase: 'O(log n)',
    worstCase: 'O(log n)',
    spaceComplexity: 'O(1)',
    code: codeFor('binary-search'),
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    description:
      'A simple sorting algorithm that builds the final sorted array one element at a time. It iterates through the array, and for each element, inserts it into its correct position within the already-sorted prefix.',
    whatFor:
      'Insertion sort is used to sort a list in place. It is efficient for small or nearly sorted data and is the method of choice when you need a stable, in-place sort with minimal code.',
    bestUseCase:
      'Best for small arrays or when the input is already mostly sorted. Often used as the base case in divide-and-conquer sorts (e.g. in hybrid quick sort) and for online sorting when elements arrive one at a time.',
    performance:
      'Best case O(n) when the array is already sorted. Average and worst case O(n²) due to comparisons and shifts. Space is O(1). For large random data, prefer merge sort or quick sort; for small n, insertion sort can be faster in practice due to low overhead.',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: codeFor('insertion-sort'),
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description:
      'A divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges the two sorted halves into one sorted array. It guarantees O(n log n) time and is stable.',
    whatFor:
      'Merge sort is used when you need a stable sort with guaranteed O(n log n) performance. It is the standard choice for sorting linked lists and when extra space is acceptable.',
    bestUseCase:
      'Best when stability matters (equal elements keep relative order), when you need predictable performance, or when sorting linked lists. Often used as the default sort in functional languages.',
    performance:
      'Always O(n log n) time in best, average, and worst case. Space O(n) for the temporary array. Stable. For in-place sorting with O(1) extra space, consider quick sort or heap sort.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(n)',
    code: codeFor('merge-sort'),
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description:
      'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    whatFor:
      'Bubble sort is mainly used for teaching. In practice, prefer insertion sort, merge sort, or quick sort for real-world sorting tasks.',
    bestUseCase:
      'Best for teaching the concept of sorting and when the list is very small or already nearly sorted. Rarely used in production.',
    performance:
      'Best case O(n) when already sorted. Average and worst case O(n²). Space O(1). Very simple but inefficient for large data.',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: codeFor('bubble-sort'),
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description:
      'A divide-and-conquer algorithm that picks a pivot, partitions the array so smaller elements are left and larger are right of the pivot, then recursively sorts the two partitions. Fast in practice.',
    whatFor:
      'Quick sort is the default choice for general-purpose in-place sorting. It is fast on average and works well with caching.',
    bestUseCase:
      'Best for sorting arrays in place when average-case performance matters. Often used as the standard library sort (e.g. with randomization or median-of-three pivot).',
    performance:
      'Average O(n log n), worst O(n²) when pivot is always smallest or largest. Best O(n log n). Space O(log n) for recursion. In-place. Not stable.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(log n)',
    code: codeFor('quick-sort'),
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description:
      'An in-place comparison sort that divides the array into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and swaps it with the first unsorted element.',
    whatFor:
      'Selection sort is used when memory writes are costly, since it does at most n swaps. It is simple and works well for small or nearly sorted data.',
    bestUseCase:
      'Best when swap cost is high (e.g. external storage) or when the list is small. Not stable; for stability use insertion or merge sort.',
    performance:
      'Always O(n²) comparisons; best, average, and worst case. Space O(1). At most n swaps. Simple but inefficient for large n.',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: codeFor('selection-sort'),
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    description:
      'A comparison-based sort that uses a binary heap. It builds a max-heap from the array, then repeatedly extracts the maximum (swaps with end) and heapifies the remaining part.',
    whatFor:
      'Heap sort is used when you need O(n log n) guaranteed and O(1) extra space. It is the basis for priority queues.',
    bestUseCase:
      'Best when you need in-place sort with guaranteed O(n log n) and cannot use quick sort (e.g. worst-case matters). Not stable.',
    performance:
      'Always O(n log n) time. Space O(1). In-place. Not stable. Slower in practice than quick sort due to cache behavior.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(1)',
    code: codeFor('heap-sort'),
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'sorting',
    description:
      'A non-comparison sort that counts the frequency of each value in a small range, then computes prefix sums and places each element in its sorted position. Works only for integers in a known range.',
    whatFor:
      'Counting sort is used when the range of values (k) is small compared to the number of elements (n). It runs in O(n + k).',
    bestUseCase:
      'Best for integers (or small keys) in a limited range, e.g. sorting by age (0–150) or by digit (0–9). Stable when implemented with prefix sum.',
    performance:
      'Time O(n + k) where k is the range. Space O(n + k). Stable. Not comparison-based; breaks the O(n log n) barrier for small k.',
    bestCase: 'O(n + k)',
    averageCase: 'O(n + k)',
    worstCase: 'O(n + k)',
    spaceComplexity: 'O(n + k)',
    code: codeFor('counting-sort'),
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'sorting',
    description:
      'A non-comparison sort that sorts integers by processing digits from least significant to most significant (or vice versa). Each digit pass is typically done with counting sort, so it is stable.',
    whatFor:
      'Radix sort is used for fixed-length integers or strings. It runs in O(n * d) where d is the number of digits.',
    bestUseCase:
      'Best for integers with a fixed number of digits, or strings of same length. Often used for large datasets of integers.',
    performance:
      'Time O(n * d) where d is digit count. Space O(n + k) per digit pass. Stable when each digit pass is stable. Not comparison-based.',
    bestCase: 'O(n * d)',
    averageCase: 'O(n * d)',
    worstCase: 'O(n * d)',
    spaceComplexity: 'O(n + k)',
    code: codeFor('radix-sort'),
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'sorting',
    description:
      'Distributes elements into a number of buckets, sorts each bucket (e.g. with insertion sort), then concatenates the buckets. Works well when the input is uniformly distributed over a range.',
    whatFor:
      'Bucket sort is used when the input is uniformly distributed over an interval. Average case is O(n) when bucket count is chosen well.',
    bestUseCase:
      'Best for uniformly distributed floating-point numbers in [0, 1) or integers in a range. Often used as a subroutine in radix sort.',
    performance:
      'Average O(n + k) with k buckets; worst O(n²) if all fall in one bucket. Space O(n). Stability depends on the inner sort.',
    bestCase: 'O(n + k)',
    averageCase: 'O(n + k)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(n)',
    code: codeFor('bucket-sort'),
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree (BST)',
    category: 'trees',
    description:
      'A binary search tree (BST) where each node has at most two children: left (smaller) and right (larger). Supports search, insert, remove, and invert operations.',
    whatFor:
      'Binary trees are used to store sorted data for fast lookup, insertion, and deletion. Invert swaps left and right subtrees at every node, useful for mirroring the tree.',
    bestUseCase:
      'Best when you need ordered data with O(log n) average operations. Search and insert follow the same path; remove handles 0, 1, or 2 children; invert is O(n) and in-place.',
    performance:
      'Search, insert, remove: O(h) where h is height (O(log n) average for random keys, O(n) worst if unbalanced). Invert: O(n). Space O(n) for the tree.',
    bestCase: 'O(log n)',
    averageCase: 'O(log n)',
    worstCase: 'O(n)',
    spaceComplexity: 'O(n)',
    code: codeFor('binary-tree'),
  },
];

export const algorithmsByCategory = {
  search: algorithms.filter((algo) => algo.category === 'search'),
  sorting: algorithms.filter((algo) => algo.category === 'sorting'),
  trees: algorithms.filter((algo) => algo.category === 'trees'),
};
