import type { AlgorithmId } from './algorithmIds';

export const PYTHON_CODE: Record<AlgorithmId, string> = {
  'linear-search': `def linear_search(arr, target):
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

  'binary-search': `def binary_search(arr, target):
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

  'insertion-sort': `def insertion_sort(arr):
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

  'merge-sort': `def merge_sort(arr):
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

  'bubble-sort': `def bubble_sort(arr):
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

  'quick-sort': `def quick_sort(arr, low=0, high=None):
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

  'selection-sort': `def selection_sort(arr):
    """
    Sort array in place using selection sort.
    """
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

arr = [4, 2, 7, 1, 9, 3, 6, 5]
selection_sort(arr)
print("Sorted:", arr)`,

  'heap-sort': `def heapify(arr, n, i):
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

arr = [4, 2, 7, 1, 9, 3, 6, 5]
heap_sort(arr)
print("Sorted:", arr)`,

  'counting-sort': `def counting_sort(arr, max_val=None):
    if max_val is None:
        max_val = max(arr)
    count = [0] * (max_val + 1)
    for x in arr:
        count[x] += 1
    for i in range(1, len(count)):
        count[i] += count[i - 1]
    out = [0] * len(arr)
    for x in reversed(arr):
        out[count[x] - 1] = x
        count[x] -= 1
    arr[:] = out

arr = [4, 2, 7, 1, 9, 3, 6, 5]
counting_sort(arr, 9)
print("Sorted:", arr)`,

  'radix-sort': `def counting_sort_by_digit(arr, exp):
    n = len(arr)
    out = [0] * n
    count = [0] * 10
    for i in range(n):
        idx = (arr[i] // exp) % 10
        count[idx] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        idx = (arr[i] // exp) % 10
        out[count[idx] - 1] = arr[i]
        count[idx] -= 1
    arr[:] = out

def radix_sort(arr):
    if not arr:
        return
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10

arr = [4, 2, 7, 1, 9, 3, 6, 5]
radix_sort(arr)
print("Sorted:", arr)`,

  'bucket-sort': `def bucket_sort(arr, bucket_count=10):
    if not arr:
        return
    min_val, max_val = min(arr), max(arr)
    bucket_range = (max_val - min_val) / bucket_count or 1
    buckets = [[] for _ in range(bucket_count)]
    for x in arr:
        idx = min(int((x - min_val) / bucket_range), bucket_count - 1)
        buckets[idx].append(x)
    for b in buckets:
        b.sort()
    arr[:] = [x for b in buckets for x in b]

arr = [4, 2, 7, 1, 9, 3, 6, 5]
bucket_sort(arr)
print("Sorted:", arr)`,

  'binary-tree': `class Node:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

def search(root, key):
    if not root or root.val == key:
        return root
    return search(root.left, key) if key < root.val else search(root.right, key)

def insert(root, key):
    if not root:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    elif key > root.val:
        root.right = insert(root.right, key)
    return root

def min_node(node):
    while node.left:
        node = node.left
    return node

def remove(root, key):
    if not root:
        return root
    if key < root.val:
        root.left = remove(root.left, key)
    elif key > root.val:
        root.right = remove(root.right, key)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        succ = min_node(root.right)
        root.val = succ.val
        root.right = remove(root.right, succ.val)
    return root

def invert(root):
    if not root:
        return root
    root.left, root.right = invert(root.right), invert(root.left)
    return root`,
};
