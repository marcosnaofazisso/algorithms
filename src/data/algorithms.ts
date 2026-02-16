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
];

export const algorithmsByCategory = {
  search: algorithms.filter((algo) => algo.category === 'search'),
  sorting: algorithms.filter((algo) => algo.category === 'sorting'),
};
