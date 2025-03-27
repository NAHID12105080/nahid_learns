---
sidebar_position: 2
---

# React Hooks

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as a way to use state and other React features without writing a class.

## Basic Hooks

### useState

The `useState` hook lets you add React state to functional components.

#### Syntax

```jsx
const [state, setState] = useState(initialState);
```

#### Key Features

- Returns a stateful value and a function to update it
- The update function can accept a new state value or a function that returns the new state
- State updates trigger re-renders

#### Example

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### useEffect

The `useEffect` hook lets you perform side effects in functional components.

#### Syntax

```jsx
useEffect(setup, dependencies?);
```

#### Key Features

- Runs after render and when dependencies change
- Can return a cleanup function
- Controls when effects run with the dependency array

#### Example

```jsx
import { useState, useEffect } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs after render and when dependencies change
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional cleanup function
    return () => {
      // Clean up any subscriptions or timers
    };
  }, []); // Empty dependency array means run once on mount

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### useContext

The `useContext` hook lets you subscribe to React context without introducing nesting.

#### Syntax

```jsx
const value = useContext(SomeContext);
```

#### Key Features

- Accepts a context object created by `createContext`
- Returns the current context value
- Updates when the provider value changes

#### Example

```jsx
import { createContext, useContext, useState } from "react";

// Create a context
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <ThemedButton />
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle Theme
        </button>
      </div>
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button
      style={{
        background: theme === "light" ? "#fff" : "#000",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      I'm styled based on theme
    </button>
  );
}
```

## Additional Hooks

### useReducer

For complex state logic, `useReducer` is often preferable to `useState`.

#### Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

#### Key Features

- Alternative to useState for complex state logic
- Based on the reducer pattern from Redux
- State transitions are predictable with actions

#### Example

```jsx
import { useReducer } from "react";

// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error("Unknown action");
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
```

### useCallback

The `useCallback` hook returns a memoized callback function.

#### Syntax

```jsx
const memoizedCallback = useCallback(callback, dependencies);
```

#### Key Features

- Memoizes a callback function to avoid unnecessary recreation
- Only changes when dependencies change
- Helps optimize child component rendering

#### Example

```jsx
import { useState, useCallback, memo } from "react";

// Memoized child component
const ChildComponent = memo(function ChildComponent({ onClick }) {
  console.log("Child rendered");
  return <button onClick={onClick}>Increment</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  // This function is created once and persisted between renders
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // Empty dependency array means function never changes

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

### useMemo

The `useMemo` hook returns a memoized value.

#### Syntax

```jsx
const memoizedValue = useMemo(calculateValue, dependencies);
```

#### Key Features

- Memoizes a computed value to avoid expensive recalculations
- Only recomputes when dependencies change
- Helps optimize performance for expensive calculations

#### Example

```jsx
import { useState, useMemo } from "react";

function ExpensiveCalculation({ list }) {
  const [filter, setFilter] = useState("");

  // This computation only happens when list or filter changes
  const filteredList = useMemo(() => {
    console.log("Filtering list...");
    return list.filter((item) => item.includes(filter));
  }, [list, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Custom Hooks

Custom hooks let you extract component logic into reusable functions.

### Creating Custom Hooks

#### Naming Convention

- Must start with "use" (e.g., `useFetch`, `useLocalStorage`)
- Follows the same rules as other hooks

#### Benefits

- Reuse stateful logic between components
- Keep components clean and focused
- Test business logic separately from UI

#### Example: useFetch

```jsx
import { useState, useEffect } from "react";

// Custom hook for fetching data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (e) {
        setError(e.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Using the custom hook
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(
    `https://api.example.com/users/${userId}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Email: {data.email}</p>
    </div>
  );
}
```

### Example: useLocalStorage

```jsx
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Get from local storage then
  // parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
```

## Rules of Hooks

### Essential Rules

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from React functional components or custom hooks
3. **Custom hooks must start with "use"** - This naming convention is important for the React linter

### Common Mistakes

```jsx
// ❌ Wrong: Hook inside a condition
function Component() {
  const [count, setCount] = useState(0);

  if (count > 0) {
    // This breaks the rules of hooks
    useEffect(() => {
      document.title = `Count: ${count}`;
    });
  }

  return <button onClick={() => setCount(count + 1)}>Increment</button>;
}

// ✅ Correct: Condition inside the hook
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 0) {
      document.title = `Count: ${count}`;
    }
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Increment</button>;
}
```

## Debugging Hooks

### Using the React DevTools

- Install the React DevTools browser extension
- Inspect component props and state
- Trace re-renders and their causes

### Common Hook Debugging Techniques

1. `console.log` the state and dependencies
2. Use the React DevTools Profiler to measure performance
3. Use ESLint with `eslint-plugin-react-hooks` to catch hook rule violations

```jsx
function DebuggingExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Effect running with count:", count);
    return () => console.log("Cleaning up effect for count:", count);
  }, [count]);

  console.log("Rendering with count:", count);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```
