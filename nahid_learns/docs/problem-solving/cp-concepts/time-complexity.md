---
sidebar_position: 2
---

# Time Complexity Analysis

Time complexity analysis is crucial in competitive programming as it helps you determine whether your solution will run within the time limits of a contest. This guide covers the fundamentals of time complexity and how to analyze algorithms.

## What is Time Complexity?

Time complexity measures how the running time of an algorithm increases as the size of the input grows. It's typically expressed using Big O notation, which describes the upper bound of an algorithm's growth rate.

## Common Time Complexities

Here's a list of common time complexities in increasing order:

| Complexity | Name         | Description                                      | Max Input Size\* |
| ---------- | ------------ | ------------------------------------------------ | ---------------- |
| O(1)       | Constant     | Running time doesn't depend on input size        | Infinite         |
| O(log n)   | Logarithmic  | Running time grows logarithmically               | 10^18+           |
| O(√n)      | Square root  | Running time grows with the square root          | 10^14            |
| O(n)       | Linear       | Running time grows linearly with input           | 10^8             |
| O(n log n) | Linearithmic | Common for efficient sorting algorithms          | 10^7             |
| O(n²)      | Quadratic    | Running time grows with square of input          | 10^4             |
| O(n³)      | Cubic        | Running time grows with cube of input            | 500              |
| O(2^n)     | Exponential  | Running time doubles with each addition to input | 20               |
| O(n!)      | Factorial    | Running time grows factorially                   | 11               |

\*Max Input Size: Approximate maximum input size that can be processed within ~1 second (varies by hardware and constants).

## Analyzing Time Complexity

To analyze the time complexity of your algorithm:

1. Identify the basic operations (comparisons, arithmetic operations, assignments)
2. Determine how many times each operation is executed in terms of input size
3. Express the total number of operations using asymptotic notation

### Examples

#### Constant Time: O(1)

```cpp
int getFirst(vector<int>& arr) {
    return arr[0]; // Always one operation, regardless of array size
}
```

#### Linear Time: O(n)

```cpp
int sum(vector<int>& arr) {
    int total = 0;
    for (int i = 0; i < arr.size(); i++) {
        total += arr[i]; // Executes n times
    }
    return total;
}
```

#### Quadratic Time: O(n²)

```cpp
void bubbleSort(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0; j < arr.size() - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
    // Nested loops: O(n²)
}
```

## Time Limits in Contests

Most competitive programming problems have a time limit of 1-2 seconds. To estimate if your solution will run within the time limit:

1. Determine the input size (n) from the problem statement
2. Calculate the time complexity of your algorithm
3. Compare the number of operations with this rough guide:
   - 10^8 operations ≈ 1 second on modern computers
   - Adjust based on language (C++ is faster than Python, for example)

## Optimizing Algorithms

If your solution exceeds the time limit, consider these optimization strategies:

1. **Improve algorithm efficiency**: Find a more efficient algorithm with better complexity
2. **Early termination**: Exit loops early when possible
3. **Memoization/Dynamic Programming**: Avoid recalculating values
4. **Use appropriate data structures**: Choose data structures with efficient operations for your needs
5. **Precomputation**: Calculate and store values that will be used multiple times

## Time Complexity Traps

Watch out for these common pitfalls:

1. **Hidden loops**: Functions like `sort()` have their own complexity (usually O(n log n))
2. **Nested loops with variable bounds**: The time complexity may not be immediately obvious
3. **Recursive functions**: Calculate the recurrence relation to determine complexity
4. **Input/Output operations**: In some languages, I/O can be a bottleneck

## Practical Example

Consider a problem with n ≤ 10^5:

- **O(n)** solution: ~10^5 operations, will easily run within time limit
- **O(n log n)** solution: ~10^6 operations, will run comfortably
- **O(n²)** solution: ~10^10 operations, will likely time out
- **O(2^n)** solution: completely infeasible

Understanding time complexity allows you to quickly determine whether your approach will work within the constraints of the problem.
