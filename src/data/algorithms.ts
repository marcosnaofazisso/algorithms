import { Algorithm } from '@/types/algorithms';

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
    pythonCode: `def linear_search(arr, target):
    """
    Linear search in an array.

    Args:
        arr: List of elements
        target: Element to search for

    Returns:
        Index of the element if found, -1 otherwise
    """
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Example usage
arr = [4, 2, 7, 1, 9, 3, 6, 5]
target = 7
result = linear_search(arr, target)

if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`,
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
    pythonCode: `def binary_search(arr, target):
    """
    Binary search in a sorted array.

    Args:
        arr: Sorted list of elements
        target: Element to search for

    Returns:
        Index of the element if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Example usage (array must be sorted)
arr = [1, 2, 3, 4, 5, 6, 7, 9]
target = 5
result = binary_search(arr, target)

if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`,
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
    pythonCode: `def insertion_sort(arr):
    """
    Sort array in place using insertion sort.

    Args:
        arr: List of comparable elements (modified in place)
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

# Example usage
arr = [4, 2, 7, 1, 9, 3, 6, 5]
insertion_sort(arr)
print("Sorted array:", arr)`,
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
    pythonCode: `def merge_sort(arr):
    """
    Sort array using merge sort (divide and conquer).

    Args:
        arr: List of comparable elements (modified in place via helper)
    """
    if len(arr) <= 1:
        return
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    merge_sort(left)
    merge_sort(right)
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]
        i += 1
        k += 1
    while j < len(right):
        arr[k] = right[j]
        j += 1
        k += 1

# Example usage
arr = [4, 2, 7, 1, 9, 3, 6, 5]
merge_sort(arr)
print("Sorted array:", arr)`,
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
    pythonCode: `def bubble_sort(arr):
    """
    Sort array in place using bubble sort.

    Args:
        arr: List of comparable elements (modified in place)
    """
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break

# Example usage
arr = [4, 2, 7, 1, 9, 3, 6, 5]
bubble_sort(arr)
print("Sorted array:", arr)`,
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
    pythonCode: `def quick_sort(arr, low=0, high=None):
    """
    Sort array in place using quick sort.

    Args:
        arr: List of comparable elements (modified in place)
        low: Start index
        high: End index (inclusive)
    """
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example usage
arr = [4, 2, 7, 1, 9, 3, 6, 5]
quick_sort(arr)
print("Sorted array:", arr)`,
  },
];

export const algorithmsByCategory = {
  search: algorithms.filter((algo) => algo.category === 'search'),
  sorting: algorithms.filter((algo) => algo.category === 'sorting'),
};
