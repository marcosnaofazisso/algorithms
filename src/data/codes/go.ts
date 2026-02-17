import type { AlgorithmId } from './algorithmIds';

export const GO_CODE: Record<AlgorithmId, string> = {
  'linear-search': `func linearSearch(arr []int, target int) int {
    for i, v := range arr {
        if v == target { return i }
    }
    return -1
}

// arr := []int{4, 2, 7, 1, 9, 3, 6, 5}
// result := linearSearch(arr, 7)`,

  'binary-search': `func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target { return mid }
        if arr[mid] < target { left = mid + 1 } else { right = mid - 1 }
    }
    return -1
}`,

  'insertion-sort': `func insertionSort(arr []int) {
    for i := 1; i < len(arr); i++ {
        key, j := arr[i], i-1
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j--
        }
        arr[j+1] = key
    }
}`,

  'merge-sort': `func mergeSort(arr []int) {
    if len(arr) <= 1 { return }
    mid := len(arr) / 2
    left := make([]int, mid)
    copy(left, arr[:mid])
    right := make([]int, len(arr)-mid)
    copy(right, arr[mid:])
    mergeSort(left)
    mergeSort(right)
    i, j, k := 0, 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] { arr[k] = left[i]; i++ } else { arr[k] = right[j]; j++ }
        k++
    }
    for i < len(left) { arr[k] = left[i]; i++; k++ }
    for j < len(right) { arr[k] = right[j]; j++; k++ }
}`,

  'bubble-sort': `func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n; i++ {
        swapped := false
        for j := 0; j < n-1-i; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = true
            }
        }
        if !swapped { break }
    }
}`,

  'quick-sort': `func quickSort(arr []int, low, high int) {
    if low < high {
        pi := partition(arr, low, high)
        quickSort(arr, low, pi-1)
        quickSort(arr, pi+1, high)
    }
}
func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    for j := low; j < high; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`,

  'selection-sort': `func selectionSort(arr []int) {
    n := len(arr)
    for i := 0; i < n; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIdx] { minIdx = j }
        }
        arr[i], arr[minIdx] = arr[minIdx], arr[i]
    }
}`,

  'heap-sort': `func heapify(arr []int, n, i int) {
    largest := i
    l, r := 2*i+1, 2*i+2
    if l < n && arr[l] > arr[largest] { largest = l }
    if r < n && arr[r] > arr[largest] { largest = r }
    if largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
    }
}
func heapSort(arr []int) {
    n := len(arr)
    for i := n/2 - 1; i >= 0; i-- { heapify(arr, n, i) }
    for i := n - 1; i > 0; i-- {
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    }
}`,

  'counting-sort': `func countingSort(arr []int, maxVal int) {
    count := make([]int, maxVal+1)
    for _, x := range arr { count[x]++ }
    for i := 1; i < len(count); i++ { count[i] += count[i-1] }
    out := make([]int, len(arr))
    for i := len(arr) - 1; i >= 0; i-- {
        out[count[arr[i]]-1] = arr[i]
        count[arr[i]]--
    }
    copy(arr, out)
}`,

  'radix-sort': `func countingSortByDigit(arr []int, exp int) {
    n := len(arr)
    out := make([]int, n)
    count := make([]int, 10)
    for _, x := range arr { count[(x/exp)%10]++ }
    for i := 1; i < 10; i++ { count[i] += count[i-1] }
    for i := n - 1; i >= 0; i-- {
        idx := (arr[i] / exp) % 10
        out[count[idx]-1] = arr[i]
        count[idx]--
    }
    copy(arr, out)
}
func radixSort(arr []int) {
    if len(arr) == 0 { return }
    max := arr[0]
    for _, x := range arr { if x > max { max = x } }
    for exp := 1; max/exp > 0; exp *= 10 { countingSortByDigit(arr, exp) }
}`,

  'bucket-sort': `func bucketSort(arr []float64, bucketCount int) {
    if len(arr) == 0 { return }
    min, max := arr[0], arr[0]
    for _, x := range arr { if x < min { min = x }; if x > max { max = x } }
    range_ := (max - min) / float64(bucketCount)
    if range_ == 0 { range_ = 1 }
    buckets := make([][]float64, bucketCount)
    for _, x := range arr {
        idx := int((x - min) / range_)
        if idx >= bucketCount { idx = bucketCount - 1 }
        buckets[idx] = append(buckets[idx], x)
    }
    i := 0
    for _, b := range buckets {
        sort.Float64s(b)
        for _, x := range b { arr[i] = x; i++ }
    }
}`,

  'binary-tree': `type Node struct {
    Val   int
    Left  *Node
    Right *Node
}
func (n *Node) New(val int) *Node { return &Node{Val: val} }
func search(root *Node, key int) *Node {
    if root == nil || root.Val == key { return root }
    if key < root.Val { return search(root.Left, key) }
    return search(root.Right, key)
}
func insert(root *Node, key int) *Node {
    if root == nil { return &Node{Val: key} }
    if key < root.Val { root.Left = insert(root.Left, key) }
    else if key > root.Val { root.Right = insert(root.Right, key) }
    return root
}
func minNode(node *Node) *Node {
    for node.Left != nil { node = node.Left }
    return node
}
func remove(root *Node, key int) *Node {
    if root == nil { return nil }
    if key < root.Val { root.Left = remove(root.Left, key) }
    else if key > root.Val { root.Right = remove(root.Right, key) }
    else {
        if root.Left == nil { return root.Right }
        if root.Right == nil { return root.Left }
        succ := minNode(root.Right)
        root.Val = succ.Val
        root.Right = remove(root.Right, succ.Val)
    }
    return root
}
func invert(root *Node) *Node {
    if root == nil { return nil }
    root.Left, root.Right = invert(root.Right), invert(root.Left)
    return root
}`,
};
