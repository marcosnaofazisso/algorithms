import type { AlgorithmId } from './algorithmIds';

export const JAVA_CODE: Record<AlgorithmId, string> = {
  'linear-search': `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}

// Example usage
// int[] arr = {4, 2, 7, 1, 9, 3, 6, 5};
// int result = linearSearch(arr, 7);`,

  'binary-search': `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Example: int[] arr = {1,2,3,4,5,6,7,9};
// int result = binarySearch(arr, 5);`,

  'insertion-sort': `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,

  'merge-sort': `public static void mergeSort(int[] arr) {
    if (arr.length <= 1) return;
    int mid = arr.length / 2;
    int[] left = Arrays.copyOfRange(arr, 0, mid);
    int[] right = Arrays.copyOfRange(arr, mid, arr.length);
    mergeSort(left);
    mergeSort(right);
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,

  'bubble-sort': `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

  'quick-sort': `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
static int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;
    return i + 1;
}`,

  'selection-sort': `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t;
    }
}`,

  'heap-sort': `static void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
        heapify(arr, n, largest);
    }
}
public static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}`,

  'counting-sort': `public static void countingSort(int[] arr, int maxVal) {
    int[] count = new int[maxVal + 1];
    for (int x : arr) count[x]++;
    for (int i = 1; i < count.length; i++) count[i] += count[i-1];
    int[] out = new int[arr.length];
    for (int i = arr.length - 1; i >= 0; i--) {
        out[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    System.arraycopy(out, 0, arr, 0, arr.length);
}`,

  'radix-sort': `static void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] out = new int[n];
    int[] count = new int[10];
    for (int i = 0; i < n; i++) count[(arr[i]/exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i-1];
    for (int i = n - 1; i >= 0; i--) {
        int idx = (arr[i]/exp) % 10;
        out[--count[idx]] = arr[i];
    }
    System.arraycopy(out, 0, arr, 0, n);
}
public static void radixSort(int[] arr) {
    if (arr.length == 0) return;
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max/exp > 0; exp *= 10)
        countingSortByDigit(arr, exp);
}`,

  'bucket-sort': `public static void bucketSort(double[] arr, int bucketCount) {
    if (arr.length == 0) return;
    double min = Arrays.stream(arr).min().getAsDouble();
    double max = Arrays.stream(arr).max().getAsDouble();
    double range = (max - min) / bucketCount;
    if (range == 0) range = 1;
    List<List<Double>> buckets = new ArrayList<>(bucketCount);
    for (int i = 0; i < bucketCount; i++) buckets.add(new ArrayList<>());
    for (double x : arr)
        buckets.get(Math.min((int)((x-min)/range), bucketCount-1)).add(x);
    int i = 0;
    for (List<Double> b : buckets) {
        Collections.sort(b);
        for (double x : b) arr[i++] = x;
    }
}`,

  'binary-tree': `class Node {
    int val;
    Node left, right;
    Node(int val) { this.val = val; }
}
static Node search(Node root, int key) {
    if (root == null || root.val == key) return root;
    return key < root.val ? search(root.left, key) : search(root.right, key);
}
static Node insert(Node root, int key) {
    if (root == null) return new Node(key);
    if (key < root.val) root.left = insert(root.left, key);
    else if (key > root.val) root.right = insert(root.right, key);
    return root;
}
static Node minNode(Node node) {
    while (node.left != null) node = node.left;
    return node;
}
static Node remove(Node root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = remove(root.left, key);
    else if (key > root.val) root.right = remove(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        Node succ = minNode(root.right);
        root.val = succ.val;
        root.right = remove(root.right, succ.val);
    }
    return root;
}
static Node invert(Node root) {
    if (root == null) return null;
    Node tmp = root.left;
    root.left = invert(root.right);
    root.right = invert(tmp);
    return root;
}`,
};
