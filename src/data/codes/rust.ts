import type { AlgorithmId } from './algorithmIds';

export const RUST_CODE: Record<AlgorithmId, string> = {
  'linear-search': `fn linear_search(arr: &[i32], target: i32) -> Option<usize> {
    arr.iter().position(|&x| x == target)
}

// let arr = [4, 2, 7, 1, 9, 3, 6, 5];
// let result = linear_search(&arr, 7);`,

  'binary-search': `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let (mut left, mut right) = (0, arr.len().saturating_sub(1));
    while left <= right {
        let mid = left + (right - left) / 2;
        if arr[mid] == target { return Some(mid); }
        if arr[mid] < target { left = mid + 1; } else { right = mid.saturating_sub(1); }
    }
    None
}`,

  'insertion-sort': `fn insertion_sort(arr: &mut [i32]) {
    for i in 1..arr.len() {
        let key = arr[i];
        let mut j = i;
        while j > 0 && arr[j - 1] > key {
            arr[j] = arr[j - 1];
            j -= 1;
        }
        arr[j] = key;
    }
}`,

  'merge-sort': `fn merge_sort(arr: &mut [i32]) {
    if arr.len() <= 1 { return; }
    let mid = arr.len() / 2;
    let mut left = arr[..mid].to_vec();
    let mut right = arr[mid..].to_vec();
    merge_sort(&mut left);
    merge_sort(&mut right);
    let (mut i, mut j, mut k) = (0, 0, 0);
    while i < left.len() && j < right.len() {
        arr[k] = if left[i] <= right[j] { let v = left[i]; i += 1; v }
                 else { let v = right[j]; j += 1; v };
        k += 1;
    }
    while i < left.len() { arr[k] = left[i]; i += 1; k += 1; }
    while j < right.len() { arr[k] = right[j]; j += 1; k += 1; }
}`,

  'bubble-sort': `fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        let mut swapped = false;
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped { break; }
    }
}`,

  'quick-sort': `fn quick_sort(arr: &mut [i32], low: usize, high: usize) {
    if low < high {
        let pi = partition(arr, low, high);
        quick_sort(arr, low, pi.saturating_sub(1));
        quick_sort(arr, pi + 1, high);
    }
}
fn partition(arr: &mut [i32], low: usize, high: usize) -> usize {
    let pivot = arr[high];
    let mut i = low as i32 - 1;
    for j in low..high {
        if arr[j] <= pivot {
            i += 1;
            arr.swap(i as usize, j);
        }
    }
    arr.swap((i + 1) as usize, high);
    (i + 1) as usize
}`,

  'selection-sort': `fn selection_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        let min_idx = (i..n).min_by_key(|&j| arr[j]).unwrap();
        arr.swap(i, min_idx);
    }
}`,

  'heap-sort': `fn heapify(arr: &mut [i32], n: usize, i: usize) {
    let mut largest = i;
    let (l, r) = (2 * i + 1, 2 * i + 2);
    if l < n && arr[l] > arr[largest] { largest = l; }
    if r < n && arr[r] > arr[largest] { largest = r; }
    if largest != i {
        arr.swap(i, largest);
        heapify(arr, n, largest);
    }
}
fn heap_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in (0..n / 2).rev() { heapify(arr, n, i); }
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify(arr, i, 0);
    }
}`,

  'counting-sort': `fn counting_sort(arr: &mut [i32], max_val: usize) {
    let mut count = vec![0; max_val + 1];
    for &x in arr.iter() { count[x as usize] += 1; }
    for i in 1..count.len() { count[i] += count[i - 1]; }
    let out: Vec<i32> = arr.iter().rev().map(|&x| {
        count[x as usize] -= 1;
        (count[x as usize], x)
    }).map(|(_, x)| x).collect();
    arr.copy_from_slice(&out);
}`,

  'radix-sort': `fn counting_sort_by_digit(arr: &mut [i32], exp: i32) {
    let n = arr.len();
    let mut out = vec![0; n];
    let mut count = [0; 10];
    for &x in arr.iter() { count[((x / exp) % 10) as usize] += 1; }
    for i in 1..10 { count[i] += count[i - 1]; }
    for i in (0..n).rev() {
        let idx = ((arr[i] / exp) % 10) as usize;
        out[count[idx] - 1] = arr[i];
        count[idx] -= 1;
    }
    arr.copy_from_slice(&out);
}
fn radix_sort(arr: &mut [i32]) {
    if arr.is_empty() { return; }
    let max = *arr.iter().max().unwrap();
    let mut exp = 1;
    while max / exp > 0 {
        counting_sort_by_digit(arr, exp);
        exp *= 10;
    }
}`,

  'bucket-sort': `fn bucket_sort(arr: &mut [f64], bucket_count: usize) {
    if arr.is_empty() { return; }
    let (min, max) = (arr.iter().cloned().fold(f64::NAN, f64::min),
                      arr.iter().cloned().fold(f64::NAN, f64::max));
    let range = (max - min) / bucket_count as f64;
    let range = if range == 0.0 { 1.0 } else { range };
    let mut buckets: Vec<Vec<f64>> = (0..bucket_count).map(|_| vec![]).collect();
    for &x in arr.iter() {
        let idx = ((x - min) / range).floor() as usize;
        let idx = idx.min(bucket_count - 1);
        buckets[idx].push(x);
    }
    let mut i = 0;
    for mut b in buckets {
        b.sort_by(|a, b| a.partial_cmp(b).unwrap());
        for x in b { arr[i] = x; i += 1; }
    }
}`,

  'binary-tree': `#[derive(Debug)]
struct Node {
    val: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}
fn search(root: Option<&Box<Node>>, key: i32) -> Option<&Box<Node>> {
    match root {
        None => None,
        Some(n) if n.val == key => Some(n),
        Some(n) if key < n.val => search(n.left.as_ref(), key),
        Some(n) => search(n.right.as_ref(), key),
    }
}
fn insert(root: Option<Box<Node>>, key: i32) -> Box<Node> {
    match root {
        None => Box::new(Node { val: key, left: None, right: None }),
        Some(mut n) => {
            if key < n.val { n.left = Some(insert(n.left.take(), key)); }
            else if key > n.val { n.right = Some(insert(n.right.take(), key)); }
            n
        }
    }
}
fn min_node(mut node: Box<Node>) -> Box<Node> {
    while node.left.is_some() { node = node.left.take().unwrap(); }
    node
}
fn remove_min(root: Option<Box<Node>>) -> (i32, Option<Box<Node>>) {
    let mut n = root.unwrap();
    if n.left.is_some() {
        let (v, left) = remove_min(n.left.take());
        n.left = left;
        (v, Some(n))
    } else {
        (n.val, n.right.take())
    }
}
fn remove(root: Option<Box<Node>>, key: i32) -> Option<Box<Node>> {
    let mut n = root?;
    if key < n.val { n.left = remove(n.left.take(), key); }
    else if key > n.val { n.right = remove(n.right.take(), key); }
    else {
        if n.left.is_none() { return n.right; }
        if n.right.is_none() { return n.left; }
        let (succ_val, new_right) = remove_min(n.right.take());
        n.val = succ_val;
        n.right = new_right;
    }
    Some(n)
}
fn invert(root: Option<Box<Node>>) -> Option<Box<Node>> {
    let mut n = root?;
    n.left = invert(n.right.take());
    n.right = invert(n.left.take());
    Some(n)
}`,
};
