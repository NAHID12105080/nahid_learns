---
sidebar_position: 2
---

# React Hooks

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as a way to use state and other React features without writing a class.

## Basic Hooks

### useState

The `useState` hook lets you add React state to functional components:

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

The `useEffect` hook lets you perform side effects in functional components:

```jsx
import { useState, useEffect } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs after render and when dependencies change
    fetch("https://api.example.com/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });

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

The `useContext` hook lets you subscribe to React context without introducing nesting:

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

For complex state logic, `useReducer` is often preferable to `useState`:

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
      throw new Error();
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

The `useCallback` hook returns a memoized callback function:

```jsx
import { useState, useCallback } from "react";

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

function ChildComponent({ onClick }) {
  console.log("Child rendered");
  return <button onClick={onClick}>Increment</button>;
}
```

### useMemo

The `useMemo` hook returns a memoized value:

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

You can create your own hooks to extract component logic into reusable functions:

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

## Rules of Hooks

To ensure hooks work correctly:

1. Only call hooks at the top level of your component or custom hooks
2. Don't call hooks inside loops, conditions, or nested functions
3. Only call hooks from React functional components or custom hooks

Understanding and effectively using hooks is essential for modern React development.
