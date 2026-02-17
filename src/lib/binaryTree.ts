/**
 * Binary Search Tree node and operations for visualization.
 * Each node has a unique id for React keys and highlighting.
 */

let nextId = 0;
export function resetTreeId() {
  nextId = 0;
}

export function freshId() {
  return `n${++nextId}`;
}

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function createNode(value: number, id = freshId()): TreeNode {
  return { id, value, left: null, right: null };
}

export function cloneTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  return {
    id: root.id,
    value: root.value,
    left: cloneTree(root.left),
    right: cloneTree(root.right),
  };
}

/** Returns path from root to node with value key, or to null (not found). */
export function searchPath(root: TreeNode | null, key: number): TreeNode[] {
  const path: TreeNode[] = [];
  let curr: TreeNode | null = root;
  while (curr) {
    path.push(curr);
    if (curr.value === key) return path;
    curr = key < curr.value ? curr.left : curr.right;
  }
  return path;
}

/** Insert key into BST; returns new root (immutable). Assigns new id to the new node only. */
export function insert(root: TreeNode | null, key: number): TreeNode {
  if (!root) return createNode(key);
  const node = { ...root };
  if (key < root.value) {
    node.left = insert(root.left, key);
  } else if (key > root.value) {
    node.right = insert(root.right, key);
  }
  return node;
}

/** Find minimum node in subtree. */
function minNode(node: TreeNode): TreeNode {
  let curr: TreeNode = node;
  while (curr.left) curr = curr.left;
  return curr;
}

/** Remove key from BST; returns new root (immutable). */
export function remove(root: TreeNode | null, key: number): TreeNode | null {
  if (!root) return null;
  const node = { ...root };
  if (key < root.value) {
    node.left = remove(root.left, key);
    return node;
  }
  if (key > root.value) {
    node.right = remove(root.right, key);
    return node;
  }
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  const succ = minNode(root.right);
  node.value = succ.value;
  node.right = remove(root.right, succ.value);
  return node;
}

/** Invert tree in place (swap left/right at every node). Returns root. */
export function invert(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const node = { ...root };
  node.left = invert(root.right);
  node.right = invert(root.left);
  return node;
}

/** Build BST from array of values (insert in order). */
export function fromArray(values: number[]): TreeNode | null {
  resetTreeId();
  let root: TreeNode | null = null;
  for (const v of values) {
    root = insert(root, v);
  }
  return root;
}

/** In-order traversal: left, node, right. */
export function inOrder(root: TreeNode | null): TreeNode[] {
  if (!root) return [];
  return [...inOrder(root.left), root, ...inOrder(root.right)];
}

/**
 * Tree layout: y = depth, x = in-order index.
 * Classic BST visualization with straight edges from parent to child.
 */
export function computeLayout(root: TreeNode | null): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  const nodes = inOrder(root);
  const gapX = 40;
  const gapY = 52;

  function assignY(r: TreeNode | null, depth: number) {
    if (!r) return;
    map.set(r.id, { x: 0, y: depth * gapY });
    assignY(r.left, depth + 1);
    assignY(r.right, depth + 1);
  }
  assignY(root, 0);

  nodes.forEach((n, i) => {
    const pos = map.get(n.id)!;
    pos.x = i * gapX;
  });
  return map;
}
