---
sidebar_position: 4
---

# Essential Algorithms

Algorithms are the backbone of competitive programming. This guide covers the most important algorithms you'll encounter in competitive programming contests and coding interviews.

## Searching Algorithms

Searching algorithms are used to find an element in a data structure.

### Linear Search

- **Time Complexity**: O(n)
- **Usage**: Searching in unsorted arrays

```cpp
int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1; // Not found
}
```

### Binary Search

- **Time Complexity**: O(log n)
- **Usage**: Searching in sorted arrays or any monotonic function

```cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Not found
}
```

#### Binary Search on Answer

Often used to find the minimum/maximum value that satisfies a condition.

```cpp
int findMinimum(vector<int>& arr, function<bool(int)> check) {
    int left = /* minimum possible value */;
    int right = /* maximum possible value */;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (check(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

## Sorting Algorithms

Sorting is a fundamental operation in many algorithms.

### Merge Sort

- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Usage**: Stable sort with guaranteed performance

```cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }

    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (i = 0; i < k; i++) arr[left + i] = temp[i];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
```

### Quick Sort

- **Time Complexity**: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(log n)
- **Usage**: In-place sorting with good average performance

```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

### Counting Sort

- **Time Complexity**: O(n + k), where k is the range of values
- **Space Complexity**: O(n + k)
- **Usage**: When the range of values is small compared to n

```cpp
void countingSort(vector<int>& arr) {
    int max_val = *max_element(arr.begin(), arr.end());
    vector<int> count(max_val + 1, 0);

    for (int x : arr) count[x]++;

    int i = 0;
    for (int j = 0; j <= max_val; j++) {
        while (count[j] > 0) {
            arr[i++] = j;
            count[j]--;
        }
    }
}
```

## Graph Algorithms

Graph algorithms are crucial for problems involving networks, paths, and connectivity.

### Depth-First Search (DFS)

- **Time Complexity**: O(V + E), where V is the number of vertices and E is the number of edges
- **Usage**: Traversing graphs, finding paths, detecting cycles, topological sorting

```cpp
void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    // Process node

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}
```

### Breadth-First Search (BFS)

- **Time Complexity**: O(V + E)
- **Usage**: Finding shortest paths in unweighted graphs, level-order traversal

```cpp
void bfs(vector<vector<int>>& graph, int start) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        // Process node

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

### Dijkstra's Algorithm

- **Time Complexity**: O((V + E) log V) with priority queue
- **Usage**: Finding shortest paths in weighted graphs (no negative weights)

```cpp
vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        int d = pq.top().first;
        int node = pq.top().second;
        pq.pop();

        if (d > dist[node]) continue;

        for (auto& [neighbor, weight] : graph[node]) {
            if (dist[node] + weight < dist[neighbor]) {
                dist[neighbor] = dist[node] + weight;
                pq.push({dist[neighbor], neighbor});
            }
        }
    }

    return dist;
}
```

### Bellman-Ford Algorithm

- **Time Complexity**: O(V \* E)
- **Usage**: Finding shortest paths with negative weights, detecting negative cycles

```cpp
vector<int> bellmanFord(vector<vector<int>>& edges, int n, int start) {
    vector<int> dist(n, INT_MAX);
    dist[start] = 0;

    for (int i = 0; i < n - 1; i++) {
        for (auto& edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // Check for negative cycles
    for (auto& edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            // Negative cycle exists
            return {};
        }
    }

    return dist;
}
```

### Floyd-Warshall Algorithm

- **Time Complexity**: O(V³)
- **Usage**: Finding all-pairs shortest paths

```cpp
vector<vector<int>> floydWarshall(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<vector<int>> dist = graph;

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    return dist;
}
```

### Minimum Spanning Tree (MST)

#### Kruskal's Algorithm

- **Time Complexity**: O(E log E), where E is the number of edges
- **Usage**: Finding MST using edge sorting and union-find

```cpp
struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

int kruskalMST(vector<Edge>& edges, int n) {
    sort(edges.begin(), edges.end());

    // Union-Find data structure
    vector<int> parent(n);
    for (int i = 0; i < n; i++) parent[i] = i;

    function<int(int)> find = [&](int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    };

    auto unite = [&](int x, int y) {
        parent[find(x)] = find(y);
    };

    int mst_weight = 0;
    for (Edge& edge : edges) {
        if (find(edge.u) != find(edge.v)) {
            unite(edge.u, edge.v);
            mst_weight += edge.weight;
        }
    }

    return mst_weight;
}
```

#### Prim's Algorithm

- **Time Complexity**: O(E log V) with priority queue
- **Usage**: Finding MST using vertex selection

```cpp
int primMST(vector<vector<pair<int, int>>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    int mst_weight = 0;
    pq.push({0, 0}); // Start from vertex 0

    while (!pq.empty()) {
        int w = pq.top().first;
        int node = pq.top().second;
        pq.pop();

        if (visited[node]) continue;

        visited[node] = true;
        mst_weight += w;

        for (auto& [neighbor, weight] : graph[node]) {
            if (!visited[neighbor]) {
                pq.push({weight, neighbor});
            }
        }
    }

    return mst_weight;
}
```

## Dynamic Programming

Dynamic programming solves complex problems by breaking them down into overlapping subproblems.

### Fibonacci (Example of DP)

- **Time Complexity**: O(n)
- **Space Complexity**: O(n) (can be optimized to O(1))

```cpp
int fibonacci(int n) {
    if (n <= 1) return n;

    vector<int> dp(n + 1);
    dp[0] = 0, dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}
```

### Longest Increasing Subsequence (LIS)

- **Time Complexity**: O(n log n) using binary search
- **Usage**: Finding the longest subsequence that is strictly increasing

```cpp
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;

    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }

    return tails.size();
}
```

### Knapsack Problem

- **Time Complexity**: O(n \* W), where n is the number of items and W is the knapsack capacity
- **Usage**: Maximizing value with weight constraint

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return dp[n][capacity];
}
```

### Edit Distance

- **Time Complexity**: O(m \* n), where m and n are the lengths of the two strings
- **Usage**: Finding the minimum number of operations to transform one string to another

```cpp
int editDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
        }
    }

    return dp[m][n];
}
```

## String Algorithms

String processing is common in competitive programming.

### Z Algorithm

- **Time Complexity**: O(n)
- **Usage**: Pattern matching, finding all occurrences of a pattern

```cpp
vector<int> zFunction(string s) {
    int n = s.size();
    vector<int> z(n, 0);

    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r) {
            z[i] = min(r - i + 1, z[i - l]);
        }

        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }

        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }

    return z;
}
```

### KMP Algorithm

- **Time Complexity**: O(n + m), where n is the text length and m is the pattern length
- **Usage**: Efficient string pattern matching

```cpp
vector<int> computeLPS(string pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);

    for (int i = 1, len = 0; i < m; ) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else if (len > 0) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }

    return lps;
}

vector<int> kmpSearch(string text, string pattern) {
    vector<int> lps = computeLPS(pattern);
    vector<int> matches;

    int n = text.size(), m = pattern.size();
    int i = 0, j = 0;

    while (i < n) {
        if (pattern[j] == text[i]) {
            i++; j++;
        }

        if (j == m) {
            matches.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j > 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return matches;
}
```

## Mathematics

Mathematical algorithms are fundamental in competitive programming.

### Greatest Common Divisor (GCD)

- **Time Complexity**: O(log min(a, b))
- **Usage**: Finding the largest number that divides both a and b

```cpp
int gcd(int a, int b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}
```

### Sieve of Eratosthenes

- **Time Complexity**: O(n log log n)
- **Usage**: Finding all prime numbers up to n efficiently

```cpp
vector<bool> sieveOfEratosthenes(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;

    for (int i = 2; i * i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i) {
                is_prime[j] = false;
            }
        }
    }

    return is_prime;
}
```

### Fast Modular Exponentiation

- **Time Complexity**: O(log n)
- **Usage**: Computing (x^n) % mod efficiently

```cpp
int modPow(int x, int n, int mod) {
    int result = 1;
    x %= mod;

    while (n > 0) {
        if (n % 2 == 1) {
            result = (1LL * result * x) % mod;
        }
        x = (1LL * x * x) % mod;
        n /= 2;
    }

    return result;
}
```

## Greedy Algorithms

Greedy algorithms make locally optimal choices to find a global optimum.

### Activity Selection

- **Time Complexity**: O(n log n) for sorting
- **Usage**: Selecting maximum number of non-overlapping activities

```cpp
int activitySelection(vector<pair<int, int>>& activities) {
    // Sort by ending time
    sort(activities.begin(), activities.end(), [](auto& a, auto& b) {
        return a.second < b.second;
    });

    int count = 0;
    int end_time = -1;

    for (auto& [start, end] : activities) {
        if (start >= end_time) {
            count++;
            end_time = end;
        }
    }

    return count;
}
```

### Fractional Knapsack

- **Time Complexity**: O(n log n) for sorting
- **Usage**: Maximizing value when fraction of items can be taken

```cpp
double fractionalKnapsack(vector<pair<int, int>>& items, int capacity) {
    // Sort by value/weight ratio (descending)
    sort(items.begin(), items.end(), [](auto& a, auto& b) {
        return (double)a.first / a.second > (double)b.first / b.second;
    });

    double value = 0.0;

    for (auto& [val, weight] : items) {
        if (capacity >= weight) {
            // Take the whole item
            value += val;
            capacity -= weight;
        } else {
            // Take a fraction of the item
            value += val * ((double)capacity / weight);
            break;
        }
    }

    return value;
}
```

## Conclusion

This guide covers many essential algorithms for competitive programming, but it's not exhaustive. The best way to master these algorithms is through consistent practice and solving various problems that require their application.

Remember these key principles when choosing an algorithm:

1. Understand the problem constraints (time and memory limits)
2. Consider the input size and required time complexity
3. Analyze the problem structure to identify the appropriate algorithm
4. Practice implementing these algorithms until they become second nature
