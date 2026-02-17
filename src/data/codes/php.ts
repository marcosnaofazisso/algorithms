import type { AlgorithmId } from './algorithmIds';

export const PHP_CODE: Record<AlgorithmId, string> = {
  'linear-search': `function linearSearch(array $arr, int $target): int
{
    foreach ($arr as $i => $v)
        if ($v === $target) return $i;
    return -1;
}

// $arr = [4, 2, 7, 1, 9, 3, 6, 5];
// $result = linearSearch($arr, 7);`,

  'binary-search': `function binarySearch(array $arr, int $target): int
{
    $left = 0;
    $right = count($arr) - 1;
    while ($left <= $right) {
        $mid = (int)(($left + $right) / 2);
        if ($arr[$mid] === $target) return $mid;
        if ($arr[$mid] < $target) $left = $mid + 1;
        else $right = $mid - 1;
    }
    return -1;
}`,

  'insertion-sort': `function insertionSort(array &$arr): void
{
    for ($i = 1; $i < count($arr); $i++) {
        $key = $arr[$i];
        $j = $i - 1;
        while ($j >= 0 && $arr[$j] > $key) {
            $arr[$j + 1] = $arr[$j];
            $j--;
        }
        $arr[$j + 1] = $key;
    }
}`,

  'merge-sort': `function mergeSort(array &$arr): void
{
    if (count($arr) <= 1) return;
    $mid = (int)(count($arr) / 2);
    $left = array_slice($arr, 0, $mid);
    $right = array_slice($arr, $mid);
    mergeSort($left);
    mergeSort($right);
    $i = $j = $k = 0;
    while ($i < count($left) && $j < count($right))
        $arr[$k++] = $left[$i] <= $right[$j] ? $left[$i++] : $right[$j++];
    while ($i < count($left)) $arr[$k++] = $left[$i++];
    while ($j < count($right)) $arr[$k++] = $right[$j++];
}`,

  'bubble-sort': `function bubbleSort(array &$arr): void
{
    $n = count($arr);
    for ($i = 0; $i < $n; $i++) {
        $swapped = false;
        for ($j = 0; $j < $n - 1 - $i; $j++)
            if ($arr[$j] > $arr[$j + 1]) {
                [$arr[$j], $arr[$j + 1]] = [$arr[$j + 1], $arr[$j]];
                $swapped = true;
            }
        if (!$swapped) break;
    }
}`,

  'quick-sort': `function quickSort(array &$arr, int $low = 0, ?int $high = null): void
{
    if ($high === null) $high = count($arr) - 1;
    if ($low < $high) {
        $pi = partition($arr, $low, $high);
        quickSort($arr, $low, $pi - 1);
        quickSort($arr, $pi + 1, $high);
    }
}
function partition(array &$arr, int $low, int $high): int
{
    $pivot = $arr[$high];
    $i = $low - 1;
    for ($j = $low; $j < $high; $j++)
        if ($arr[$j] <= $pivot) {
            $i++;
            [$arr[$i], $arr[$j]] = [$arr[$j], $arr[$i]];
        }
    [$arr[$i + 1], $arr[$high]] = [$arr[$high], $arr[$i + 1]];
    return $i + 1;
}`,

  'selection-sort': `function selectionSort(array &$arr): void
{
    $n = count($arr);
    for ($i = 0; $i < $n; $i++) {
        $minIdx = $i;
        for ($j = $i + 1; $j < $n; $j++)
            if ($arr[$j] < $arr[$minIdx]) $minIdx = $j;
        [$arr[$i], $arr[$minIdx]] = [$arr[$minIdx], $arr[$i]];
    }
}`,

  'heap-sort': `function heapify(array &$arr, int $n, int $i): void
{
    $largest = $i;
    $l = 2 * $i + 1;
    $r = 2 * $i + 2;
    if ($l < $n && $arr[$l] > $arr[$largest]) $largest = $l;
    if ($r < $n && $arr[$r] > $arr[$largest]) $largest = $r;
    if ($largest !== $i) {
        [$arr[$i], $arr[$largest]] = [$arr[$largest], $arr[$i]];
        heapify($arr, $n, $largest);
    }
}
function heapSort(array &$arr): void
{
    $n = count($arr);
    for ($i = (int)($n / 2) - 1; $i >= 0; $i--) heapify($arr, $n, $i);
    for ($i = $n - 1; $i > 0; $i--) {
        [$arr[0], $arr[$i]] = [$arr[$i], $arr[0]];
        heapify($arr, $i, 0);
    }
}`,

  'counting-sort': `function countingSort(array &$arr, ?int $maxVal = null): void
{
    if ($maxVal === null) $maxVal = max($arr);
    $count = array_fill(0, $maxVal + 1, 0);
    foreach ($arr as $x) $count[$x]++;
    for ($i = 1; $i < count($count); $i++) $count[$i] += $count[$i - 1];
    $out = array_fill(0, count($arr), 0);
    foreach (array_reverse($arr) as $x) {
        $out[$count[$x] - 1] = $x;
        $count[$x]--;
    }
    $arr = $out;
}`,

  'radix-sort': `function countingSortByDigit(array &$arr, int $exp): void
{
    $n = count($arr);
    $out = array_fill(0, $n, 0);
    $count = array_fill(0, 10, 0);
    foreach ($arr as $x) $count[(int)($x / $exp) % 10]++;
    for ($i = 1; $i < 10; $i++) $count[$i] += $count[$i - 1];
    for ($i = $n - 1; $i >= 0; $i--) {
        $idx = (int)($arr[$i] / $exp) % 10;
        $out[$count[$idx] - 1] = $arr[$i];
        $count[$idx]--;
    }
    $arr = $out;
}
function radixSort(array &$arr): void
{
    if (empty($arr)) return;
    $max = max($arr);
    for ($exp = 1; (int)($max / $exp) > 0; $exp *= 10)
        countingSortByDigit($arr, $exp);
}`,

  'bucket-sort': `function bucketSort(array &$arr, int $bucketCount = 10): void
{
    if (empty($arr)) return;
    $min = min($arr);
    $max = max($arr);
    $range = ($max - $min) / $bucketCount ?: 1;
    $buckets = array_fill(0, $bucketCount, []);
    foreach ($arr as $x)
        $buckets[min((int)(($x - $min) / $range), $bucketCount - 1)][] = $x;
    $i = 0;
    foreach ($buckets as $b) {
        sort($b);
        foreach ($b as $x) $arr[$i++] = $x;
    }
}`,

  'binary-tree': `class Node {
    public $val;
    public $left, $right;
    function __construct($val) { $this->val = $val; }
}
function search($root, $key) {
    if (!$root || $root->val === $key) return $root;
    return $key < $root->val ? search($root->left, $key) : search($root->right, $key);
}
function insert($root, $key) {
    if (!$root) return new Node($key);
    if ($key < $root->val) $root->left = insert($root->left, $key);
    elseif ($key > $root->val) $root->right = insert($root->right, $key);
    return $root;
}
function minNode($node) {
    while ($node->left) $node = $node->left;
    return $node;
}
function remove($root, $key) {
    if (!$root) return null;
    if ($key < $root->val) $root->left = remove($root->left, $key);
    elseif ($key > $root->val) $root->right = remove($root->right, $key);
    else {
        if (!$root->left) return $root->right;
        if (!$root->right) return $root->left;
        $succ = minNode($root->right);
        $root->val = $succ->val;
        $root->right = remove($root->right, $succ->val);
    }
    return $root;
}
function invert($root) {
    if (!$root) return null;
    [$root->left, $root->right] = [invert($root->right), invert($root->left)];
    return $root;
}`,
};
