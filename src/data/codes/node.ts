import type { AlgorithmId } from './algorithmIds';

export const NODE_CODE: Record<AlgorithmId, string> = {
  'linear-search': `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === target) return i;
  return -1;
}

// const arr = [4, 2, 7, 1, 9, 3, 6, 5];
// const result = linearSearch(arr, 7);`,

  'binary-search': `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,

  'insertion-sort': `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,

  'merge-sort': `function mergeSort(arr) {
  if (arr.length <= 1) return;
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  mergeSort(left);
  mergeSort(right);
  let i = 0, j = 0, k = 0;
  while (i < left.length && j < right.length)
    arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,

  'bubble-sort': `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++)
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    if (!swapped) break;
  }
}`,

  'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++)
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,

  'selection-sort': `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`,

  'heap-sort': `function heapify(arr, n, i) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}`,

  'counting-sort': `function countingSort(arr, maxVal = Math.max(...arr)) {
  const count = Array(maxVal + 1).fill(0);
  arr.forEach(x => count[x]++);
  for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
  const out = Array(arr.length);
  [...arr].reverse().forEach(x => {
    out[count[x] - 1] = x;
    count[x]--;
  });
  arr.splice(0, arr.length, ...out);
}`,

  'radix-sort': `function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const out = Array(n);
  const count = Array(10).fill(0);
  arr.forEach(x => count[Math.floor(x / exp) % 10]++);
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const idx = Math.floor(arr[i] / exp) % 10;
    out[count[idx] - 1] = arr[i];
    count[idx]--;
  }
  arr.splice(0, n, ...out);
}
function radixSort(arr) {
  if (!arr.length) return;
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
    countingSortByDigit(arr, exp);
}`,

  'bucket-sort': `function bucketSort(arr, bucketCount = 10) {
  if (!arr.length) return;
  const min = Math.min(...arr), max = Math.max(...arr);
  const range = (max - min) / bucketCount || 1;
  const buckets = Array.from({ length: bucketCount }, () => []);
  arr.forEach(x =>
    buckets[Math.min(Math.floor((x - min) / range), bucketCount - 1)].push(x));
  let i = 0;
  buckets.forEach(b => {
    b.sort((a, b) => a - b);
    b.forEach(x => arr[i++] = x);
  });
}`,

  'binary-tree': `class Node {
  constructor(val) { this.val = val; this.left = this.right = null; }
}
function search(root, key) {
  if (!root || root.val === key) return root;
  return key < root.val ? search(root.left, key) : search(root.right, key);
}
function insert(root, key) {
  if (!root) return new Node(key);
  if (key < root.val) root.left = insert(root.left, key);
  else if (key > root.val) root.right = insert(root.right, key);
  return root;
}
function minNode(node) {
  while (node.left) node = node.left;
  return node;
}
function remove(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = remove(root.left, key);
  else if (key > root.val) root.right = remove(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const succ = minNode(root.right);
    root.val = succ.val;
    root.right = remove(root.right, succ.val);
  }
  return root;
}
function invert(root) {
  if (!root) return null;
  [root.left, root.right] = [invert(root.right), invert(root.left)];
  return root;
}`,
};
