---
sidebar_position: 3
---

# Essential Data Structures

Data structures are fundamental tools for efficiently storing and manipulating data in competitive programming. Choosing the right data structure can often make the difference between a solution that times out and one that runs efficiently. This guide covers the most important data structures you'll need for competitive programming.

## Arrays and Vectors

Arrays are the most basic data structure, providing O(1) access to elements by index.

### Key Operations

- **Access**: O(1)
- **Search**: O(n) for unsorted, O(log n) for sorted (binary search)
- **Insertion/Deletion at end**: O(1) amortized for dynamic arrays/vectors
- **Insertion/Deletion at arbitrary position**: O(n)

### Example (C++)

```cpp
// Static array
int arr[100];

// Dynamic array (vector)
vector<int> v;
v.push_back(10); // Add element
v.pop_back();    // Remove last element
```

### Applications

- Storing sequence of elements
- Base for many other data structures
- Problems involving prefix sums or sliding window

## Linked Lists

Linked lists store elements as nodes with pointers to the next node, allowing efficient insertions and deletions at any position if you have a pointer to that position.

### Key Operations

- **Access**: O(n)
- **Search**: O(n)
- **Insertion/Deletion (with pointer to position)**: O(1)

### Example (C++)

```cpp
// Usually implemented as a class
struct Node {
    int data;
    Node* next;
};

// In competitive programming, often simulated using arrays
int data[MAX_N], next_ptr[MAX_N];
```

### Applications

- Implementations of other data structures
- Problems requiring frequent insertions/deletions at various positions

## Stacks

Stacks follow the Last In, First Out (LIFO) principle, supporting push and pop operations.

### Key Operations

- **Push**: O(1)
- **Pop**: O(1)
- **Top**: O(1)

### Example (C++)

```cpp
stack<int> s;
s.push(10);
s.push(20);
int top_element = s.top(); // Returns 20
s.pop(); // Removes 20
```

### Applications

- Expression evaluation and parsing
- Backtracking algorithms
- Implementing recursion
- Next Greater/Smaller Element problems
- Parenthesis matching

## Queues

Queues follow the First In, First Out (FIFO) principle.

### Key Operations

- **Enqueue (push)**: O(1)
- **Dequeue (pop)**: O(1)
- **Front**: O(1)

### Example (C++)

```cpp
queue<int> q;
q.push(10);
q.push(20);
int front_element = q.front(); // Returns 10
q.pop(); // Removes 10
```

### Applications

- Breadth-First Search (BFS)
- Implementing caches
- Job scheduling
- Level order traversal of trees

## Deques

Double-ended queues (deques) allow insertions and deletions at both ends.

### Key Operations

- **Push/Pop Front**: O(1)
- **Push/Pop Back**: O(1)
- **Access Front/Back**: O(1)

### Example (C++)

```cpp
deque<int> dq;
dq.push_front(10);
dq.push_back(20);
dq.pop_front();
dq.pop_back();
```

### Applications

- Sliding window problems
- Work stealing algorithms
- Palindrome checking

## Priority Queues (Heaps)

Priority queues give the highest priority element first, typically implemented as heaps.

### Key Operations

- **Insert**: O(log n)
- **Extract Min/Max**: O(log n)
- **Get Min/Max**: O(1)

### Example (C++)

```cpp
// Max heap (default in C++)
priority_queue<int> pq;
pq.push(10);
pq.push(30);
pq.push(20);
int highest = pq.top(); // Returns 30
pq.pop(); // Removes 30

// Min heap
priority_queue<int, vector<int>, greater<int>> min_pq;
```

### Applications

- Dijkstra's algorithm
- Prim's algorithm
- Huffman coding
- K largest/smallest elements
- Median maintenance

## Hash Tables

Hash tables provide average O(1) lookup, insertion, and deletion using a hash function.

### Key Operations

- **Insert**: O(1) average
- **Delete**: O(1) average
- **Search**: O(1) average

### Example (C++)

```cpp
unordered_map<string, int> mp;
mp["key"] = 10;
if (mp.count("key")) { // Check if key exists
    int val = mp["key"];
}
mp.erase("key");
```

### Applications

- Frequency counting
- Caching
- De-duplication
- Two-sum and related problems

## Sets and Multisets

Sets store unique elements in sorted order, while multisets allow duplicates.

### Key Operations

- **Insert**: O(log n)
- **Delete**: O(log n)
- **Search**: O(log n)
- **Find Next/Previous**: O(log n)

### Example (C++)

```cpp
set<int> s;
s.insert(30);
s.insert(10);
s.insert(20);
auto it = s.lower_bound(15); // Returns iterator to 20
s.erase(10);

// Multiset allows duplicates
multiset<int> ms;
ms.insert(10);
ms.insert(10); // Both 10s are stored
```

### Applications

- Maintaining sorted data
- Range queries
- Problems requiring floor/ceiling operations
- Counting unique elements

## Trees and Graphs

### Binary Trees

Trees with at most two children per node, used in various tree-based problems.

### Binary Search Trees (BST)

Trees where left child < parent < right child, enabling efficient searching.

### Example (C++)

```cpp
struct TreeNode {
    int val;
    TreeNode *left, *right;
};
```

### Graphs

Represented using adjacency lists or matrices.

```cpp
// Adjacency list
vector<int> adj[MAX_N];

// Adjacency matrix
bool adj_matrix[MAX_N][MAX_N];
```

### Applications

- Path finding (DFS, BFS)
- Minimum spanning trees
- Shortest paths
- Network flow
- Topological sorting

## Advanced Data Structures

These are useful for specific types of problems:

### Disjoint Set Union (DSU)

For grouping elements and checking connectivity efficiently.

```cpp
int parent[MAX_N];
int size[MAX_N];

void make_set(int v) {
    parent[v] = v;
    size[v] = 1;
}

int find_set(int v) {
    if (v == parent[v]) return v;
    return parent[v] = find_set(parent[v]); // Path compression
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (size[a] < size[b]) swap(a, b);
        parent[b] = a;
        size[a] += size[b];
    }
}
```

### Segment Trees

For range queries and updates in O(log n) time.

```cpp
int tree[4*MAX_N];

void build(int a[], int v, int tl, int tr) {
    if (tl == tr) {
        tree[v] = a[tl];
    } else {
        int tm = (tl + tr) / 2;
        build(a, v*2, tl, tm);
        build(a, v*2+1, tm+1, tr);
        tree[v] = tree[v*2] + tree[v*2+1];
    }
}

int sum(int v, int tl, int tr, int l, int r) {
    if (l > r) return 0;
    if (l == tl && r == tr) return tree[v];
    int tm = (tl + tr) / 2;
    return sum(v*2, tl, tm, l, min(r, tm))
         + sum(v*2+1, tm+1, tr, max(l, tm+1), r);
}

void update(int v, int tl, int tr, int pos, int new_val) {
    if (tl == tr) {
        tree[v] = new_val;
    } else {
        int tm = (tl + tr) / 2;
        if (pos <= tm)
            update(v*2, tl, tm, pos, new_val);
        else
            update(v*2+1, tm+1, tr, pos, new_val);
        tree[v] = tree[v*2] + tree[v*2+1];
    }
}
```

### Fenwick Trees (Binary Indexed Trees)

For prefix sums and point updates in O(log n) time.

```cpp
int bit[MAX_N];

void update(int i, int val) {
    for (; i < MAX_N; i += i & -i)
        bit[i] += val;
}

int query(int i) {
    int sum = 0;
    for (; i > 0; i -= i & -i)
        sum += bit[i];
    return sum;
}
```

### Trie

For efficient string operations and prefix matching.

```cpp
struct TrieNode {
    TrieNode* children[26];
    bool isEndOfWord;

    TrieNode() {
        isEndOfWord = false;
        for (int i = 0; i < 26; i++)
            children[i] = nullptr;
    }
};

void insert(TrieNode* root, string key) {
    TrieNode* pCrawl = root;
    for (char c : key) {
        int index = c - 'a';
        if (!pCrawl->children[index])
            pCrawl->children[index] = new TrieNode();
        pCrawl = pCrawl->children[index];
    }
    pCrawl->isEndOfWord = true;
}

bool search(TrieNode* root, string key) {
    TrieNode* pCrawl = root;
    for (char c : key) {
        int index = c - 'a';
        if (!pCrawl->children[index])
            return false;
        pCrawl = pCrawl->children[index];
    }
    return pCrawl->isEndOfWord;
}
```

## Choosing the Right Data Structure

When choosing a data structure, consider:

1. **What operations are needed?** (insert, delete, search, etc.)
2. **What is the required time complexity?**
3. **Are elements ordered or unordered?**
4. **Do you need to handle duplicates?**
5. **Are there range queries or updates?**

Mastering these data structures and knowing when to use each one will significantly improve your competitive programming performance.
