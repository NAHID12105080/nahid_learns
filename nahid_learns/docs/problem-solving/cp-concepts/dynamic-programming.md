---
sidebar_position: 5
---

# Dynamic Programming

Dynamic Programming (DP) is a powerful technique used to solve problems by breaking them down into simpler overlapping subproblems. It's particularly useful in competitive programming for optimization problems where we need to find the best solution among many possible options.

## Core Principles of Dynamic Programming

Dynamic Programming is based on two key principles:

1. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to its subproblems.
2. **Overlapping Subproblems**: The same subproblems are solved multiple times when a recursive solution is applied.

## When to Use Dynamic Programming

Consider using DP when your problem has these characteristics:

1. The problem can be broken down into "subproblems"
2. The solution to the original problem can be constructed from solutions to subproblems
3. Subproblems overlap (i.e., a recursive solution would solve the same subproblems repeatedly)
4. The problem asks for optimization (finding minimum, maximum, longest, shortest, etc.)

## Approaches to Dynamic Programming

There are two primary approaches to implementing DP solutions:

### Top-Down (Memoization)

1. Start with the original problem
2. Break it down into subproblems
3. Use recursion with a cache (memo) to avoid repeated calculations

```cpp
// Example: Fibonacci with memoization
vector<int> memo(100, -1);

int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);
}
```

### Bottom-Up (Tabulation)

1. Start with the smallest subproblems
2. Build up solutions to progressively larger subproblems
3. Use an array or table to store intermediate results

```cpp
// Example: Fibonacci with tabulation
int fib(int n) {
    vector<int> dp(n+1);
    dp[0] = 0, dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }

    return dp[n];
}
```

## Common DP Problem Patterns

### 1. 1D DP (Linear State)

These problems have a single state variable, typically representing a position or index.

#### Example: Maximum Subarray Sum (Kadane's Algorithm)

```cpp
int maxSubarraySum(vector<int>& arr) {
    int n = arr.size();
    int max_so_far = arr[0];
    int curr_max = arr[0];

    for (int i = 1; i < n; i++) {
        curr_max = max(arr[i], curr_max + arr[i]);
        max_so_far = max(max_so_far, curr_max);
    }

    return max_so_far;
}
```

#### Example: Climbing Stairs

Problem: Count ways to climb n stairs, taking 1 or 2 steps at a time.

```cpp
int climbStairs(int n) {
    if (n <= 2) return n;

    vector<int> dp(n+1);
    dp[1] = 1;
    dp[2] = 2;

    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }

    return dp[n];
}
```

### 2. 2D DP (Matrix State)

These problems have two state variables, often representing positions, indices, or remaining resources.

#### Example: Longest Common Subsequence (LCS)

```cpp
int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }

    return dp[m][n];
}
```

#### Example: Grid Path Problems

Problem: Find the minimum path sum from top-left to bottom-right in a grid.

```cpp
int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n));

    dp[0][0] = grid[0][0];

    // Fill first row
    for (int j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }

    // Fill first column
    for (int i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }

    // Fill rest of the table
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }

    return dp[m-1][n-1];
}
```

### 3. State Reduction Techniques

Sometimes, you can optimize memory usage by reducing the dimensions of your DP table.

#### Example: Fibonacci with O(1) Space

```cpp
int fib(int n) {
    if (n <= 1) return n;

    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return b;
}
```

#### Example: Knapsack with 1D Array

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<int> dp(W+1, 0);

    for (int i = 0; i < n; i++) {
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);
        }
    }

    return dp[W];
}
```

## Advanced DP Techniques

### 1. Bitmask DP

Using bits to represent states, often for problems involving subsets.

#### Example: Traveling Salesman Problem (TSP)

```cpp
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int all_visited = (1 << n) - 1;

    vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX));
    dp[1][0] = 0; // Start at city 0

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue;

            for (int v = 0; v < n; v++) {
                if (mask & (1 << v) && u != v) {
                    dp[mask][u] = min(dp[mask][u],
                                      dp[mask ^ (1 << u)][v] + dist[v][u]);
                }
            }
        }
    }

    int ans = INT_MAX;
    for (int i = 1; i < n; i++) {
        ans = min(ans, dp[all_visited][i] + dist[i][0]);
    }

    return ans;
}
```

### 2. Interval DP

For problems involving intervals or subarrays.

#### Example: Matrix Chain Multiplication

```cpp
int matrixChainMultiplication(vector<int>& dims) {
    int n = dims.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;

            for (int k = i; k < j; k++) {
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] +
                               dims[i] * dims[k+1] * dims[j+1]);
            }
        }
    }

    return dp[0][n-1];
}
```

### 3. Digit DP

For counting numbers with specific digit properties.

#### Example: Count numbers with digit sum = S

```cpp
// Count numbers between L and R with digit sum = S
long long digitSum(long long L, long long R, int S) {
    // Implementation omitted for brevity
    // This is a complex technique requiring specialized knowledge
}
```

### 4. DP on Trees

For problems involving tree structures.

#### Example: Maximum Path Sum in Binary Tree

```cpp
int maxPathSum(TreeNode* root) {
    int maxSum = INT_MIN;

    function<int(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return 0;

        int left = max(0, dfs(node->left));
        int right = max(0, dfs(node->right));

        maxSum = max(maxSum, node->val + left + right);

        return node->val + max(left, right);
    };

    dfs(root);
    return maxSum;
}
```

## Common DP Problems in Competitive Programming

Here are some classic DP problems you might encounter:

1. **Coin Change**: Find minimum number of coins to make a sum
2. **Longest Increasing Subsequence**: Find the longest strictly increasing subsequence
3. **Edit Distance**: Minimum operations to convert one string to another
4. **Knapsack Problem**: Maximize value with weight constraint
5. **Rod Cutting**: Maximize profit by cutting a rod into pieces
6. **Subset Sum**: Determine if a subset sums to a target
7. **Longest Common Subsequence**: Find the longest subsequence present in two strings
8. **Maximum Subarray Sum**: Find the contiguous subarray with the largest sum

## Tips for Solving DP Problems

1. **Identify the subproblems**: What smaller version of the original problem do you need to solve?
2. **Define state variables**: What information do you need to solve each subproblem?
3. **Establish recurrence relation**: How do solutions to smaller subproblems help solve larger ones?
4. **Identify base cases**: What are the simplest instances of the problem?
5. **Determine computation order**: Ensure subproblems are solved before they are needed
6. **Analyze space/time complexity**: Can you optimize your solution further?

## Optimizing DP Solutions

1. **State Reduction**: Do you really need all dimensions in your DP table?
2. **Space Optimization**: Can you use a 1D array instead of a 2D array?
3. **Recurrence Optimization**: Can you simplify your transition function?
4. **Preprocessing**: Can you precompute values to speed up transitions?

## Conclusion

Dynamic Programming is a powerful technique that can solve many complex problems efficiently. The key to mastering DP is practice - start with simple problems and gradually work your way up to more complex ones. Understanding the common patterns and techniques outlined in this guide will help you identify when and how to apply DP in competitive programming scenarios.
