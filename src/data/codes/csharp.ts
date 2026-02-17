import type { AlgorithmId } from './algorithmIds';

export const CSHARP_CODE: Record<AlgorithmId, string> = {
  'linear-search': `public static int LinearSearch(int[] arr, int target)
{
    for (int i = 0; i < arr.Length; i++)
        if (arr[i] == target) return i;
    return -1;
}

// var arr = new[] { 4, 2, 7, 1, 9, 3, 6, 5 };
// int result = LinearSearch(arr, 7);`,

  'binary-search': `public static int BinarySearch(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1;
    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,

  'insertion-sort': `public static void InsertionSort(int[] arr)
{
    for (int i = 1; i < arr.Length; i++)
    {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key)
        {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,

  'merge-sort': `public static void MergeSort(int[] arr)
{
    if (arr.Length <= 1) return;
    int mid = arr.Length / 2;
    int[] left = arr.Take(mid).ToArray();
    int[] right = arr.Skip(mid).ToArray();
    MergeSort(left);
    MergeSort(right);
    int i = 0, j = 0, k = 0;
    while (i < left.Length && j < right.Length)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.Length) arr[k++] = left[i++];
    while (j < right.Length) arr[k++] = right[j++];
}`,

  'bubble-sort': `public static void BubbleSort(int[] arr)
{
    int n = arr.Length;
    for (int i = 0; i < n; i++)
    {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++)
            if (arr[j] > arr[j + 1])
            {
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                swapped = true;
            }
        if (!swapped) break;
    }
}`,

  'quick-sort': `public static void QuickSort(int[] arr, int low, int high)
{
    if (low < high)
    {
        int pi = Partition(arr, low, high);
        QuickSort(arr, low, pi - 1);
        QuickSort(arr, pi + 1, high);
    }
}
static int Partition(int[] arr, int low, int high)
{
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) { i++; (arr[i], arr[j]) = (arr[j], arr[i]); }
    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
    return i + 1;
}`,

  'selection-sort': `public static void SelectionSort(int[] arr)
{
    int n = arr.Length;
    for (int i = 0; i < n; i++)
    {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        (arr[i], arr[minIdx]) = (arr[minIdx], arr[i]);
    }
}`,

  'heap-sort': `static void Heapify(int[] arr, int n, int i)
{
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i)
    {
        (arr[i], arr[largest]) = (arr[largest], arr[i]);
        Heapify(arr, n, largest);
    }
}
public static void HeapSort(int[] arr)
{
    int n = arr.Length;
    for (int i = n / 2 - 1; i >= 0; i--) Heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--)
    {
        (arr[0], arr[i]) = (arr[i], arr[0]);
        Heapify(arr, i, 0);
    }
}`,

  'counting-sort': `public static void CountingSort(int[] arr, int maxVal)
{
    var count = new int[maxVal + 1];
    foreach (int x in arr) count[x]++;
    for (int i = 1; i < count.Length; i++) count[i] += count[i - 1];
    var outArr = new int[arr.Length];
    for (int i = arr.Length - 1; i >= 0; i--)
        outArr[--count[arr[i]]] = arr[i];
    Array.Copy(outArr, arr, arr.Length);
}`,

  'radix-sort': `static void CountingSortByDigit(int[] arr, int exp)
{
    int n = arr.Length;
    var outArr = new int[n];
    var count = new int[10];
    foreach (int x in arr) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--)
        outArr[--count[(arr[i] / exp) % 10]] = arr[i];
    Array.Copy(outArr, arr, n);
}
public static void RadixSort(int[] arr)
{
    if (arr.Length == 0) return;
    int max = arr.Max();
    for (int exp = 1; max / exp > 0; exp *= 10)
        CountingSortByDigit(arr, exp);
}`,

  'bucket-sort': `public static void BucketSort(double[] arr, int bucketCount = 10)
{
    if (arr.Length == 0) return;
    double min = arr.Min(), max = arr.Max();
    double range = (max - min) / bucketCount;
    if (range == 0) range = 1;
    var buckets = new List<double>[bucketCount];
    for (int i = 0; i < bucketCount; i++) buckets[i] = new List<double>();
    foreach (double x in arr)
        buckets[Math.Min((int)((x - min) / range), bucketCount - 1)].Add(x);
    int i = 0;
    foreach (var b in buckets) { b.Sort(); foreach (double x in b) arr[i++] = x; }
}`,

  'binary-tree': `class Node
{
    public int Val;
    public Node Left, Right;
    public Node(int val) { Val = val; }
}
static Node Search(Node root, int key)
{
    if (root == null || root.Val == key) return root;
    return key < root.Val ? Search(root.Left, key) : Search(root.Right, key);
}
static Node Insert(Node root, int key)
{
    if (root == null) return new Node(key);
    if (key < root.Val) root.Left = Insert(root.Left, key);
    else if (key > root.Val) root.Right = Insert(root.Right, key);
    return root;
}
static Node MinNode(Node node)
{
    while (node.Left != null) node = node.Left;
    return node;
}
static Node Remove(Node root, int key)
{
    if (root == null) return null;
    if (key < root.Val) root.Left = Remove(root.Left, key);
    else if (key > root.Val) root.Right = Remove(root.Right, key);
    else
    {
        if (root.Left == null) return root.Right;
        if (root.Right == null) return root.Left;
        Node succ = MinNode(root.Right);
        root.Val = succ.Val;
        root.Right = Remove(root.Right, succ.Val);
    }
    return root;
}
static Node Invert(Node root)
{
    if (root == null) return null;
    (root.Left, root.Right) = (Invert(root.Right), Invert(root.Left));
    return root;
}`,
};
