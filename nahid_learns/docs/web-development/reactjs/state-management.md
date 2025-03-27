---
sidebar_position: 3
---

# State Management in React

Managing state effectively is a critical aspect of building React applications. This guide explores different approaches to state management in React.

## Local Component State

For simple components, local state using the `useState` hook is often sufficient:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### When to Use Local State

- For component-specific state that doesn't need to be shared
- For UI state like form inputs, toggles, etc.
- When the component hierarchy is simple

## Lifting State Up

When multiple components need access to the same state, lift the state up to their closest common ancestor:

```jsx
import { useState } from "react";

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <ChildA count={count} />
      <ChildB onIncrement={() => setCount(count + 1)} />
    </div>
  );
}

function ChildA({ count }) {
  return <p>The current count is: {count}</p>;
}

function ChildB({ onIncrement }) {
  return <button onClick={onIncrement}>Increment</button>;
}
```

### When to Lift State Up

- When siblings or parent-child components need to share state
- When you want to avoid prop drilling (to some extent)
- For moderate-sized applications with manageable component trees

## Context API

For sharing state across many components without prop drilling, use React's Context API:

```jsx
import { createContext, useContext, useState } from "react";

// Create a context
const CountContext = createContext();

// Provider component
function CountProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
}

// Custom hook for consuming context
function useCount() {
  const context = useContext(CountContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

// App with provider
function App() {
  return (
    <CountProvider>
      <div>
        <DisplayCount />
        <IncrementButton />
      </div>
    </CountProvider>
  );
}

// Consumer components
function DisplayCount() {
  const { count } = useCount();
  return <h1>Count: {count}</h1>;
}

function IncrementButton() {
  const { setCount } = useCount();
  return <button onClick={() => setCount((c) => c + 1)}>Increment</button>;
}
```

### When to Use Context

- When state needs to be accessed by many components at different nesting levels
- For theme, user authentication, language preferences, etc.
- When you want to avoid excessive prop drilling

## State Management Libraries

For complex applications, third-party state management libraries can be valuable.

### Redux

Redux is a predictable state container that centralizes application state:

```jsx
// Store setup
import { createStore } from "redux";

// Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Create store
const store = createStore(counterReducer);

// Component with Redux (using react-redux)
import { Provider, useSelector, useDispatch } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

function Counter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
    </div>
  );
}
```

### Redux Toolkit

The modern way to write Redux with less boilerplate:

```jsx
import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
});

export const { increment, decrement } = counterSlice.actions;
```

### Zustand

A minimalist state management solution:

```jsx
import create from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment, decrement } = useStore();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Jotai

An atomic approach to state management:

```jsx
import { atom, useAtom } from "jotai";

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
    </div>
  );
}
```

## Server State Management

For data from APIs, specialized tools like React Query help manage server state:

```jsx
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}

function TodoList() {
  const { data, isLoading } = useQuery("todos", fetchTodos);

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

## Choosing the Right Approach

Consider these factors when selecting a state management approach:

1. **Application size**: Simple apps can use local state and lifting state up
2. **Component tree depth**: Deep trees benefit from Context or external libraries
3. **Update frequency**: Frequently changing state needs optimized solutions
4. **Team experience**: Factor in the learning curve for your team
5. **Performance needs**: Some solutions are more performant than others

The best approach often combines multiple state management techniques based on specific needs.
