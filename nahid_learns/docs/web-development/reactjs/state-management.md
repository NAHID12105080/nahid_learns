---
sidebar_position: 3
---

# State Management in React

Managing state effectively is a critical aspect of building React applications. This guide explores different approaches to state management in React.

## Local Component State

For simple components, local state using the `useState` hook is often sufficient.

### Implementation

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

### Best Practices

- Keep state as minimal as possible
- Split state into logical pieces rather than one large state object
- Use multiple `useState` calls for unrelated state variables

## Lifting State Up

When multiple components need access to the same state, lift the state up to their closest common ancestor.

### Implementation

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

### Common Patterns

#### Controlled Components

```jsx
function ParentForm() {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submitted:", value);
      }}
    >
      <ControlledInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}
```

#### Shared State Manager

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} />
    </div>
  );
}
```

## Context API

For sharing state across many components without prop drilling, use React's Context API.

### Creating and Using Context

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

### Context Best Practices

#### Split Contexts by Domain

```jsx
// Multiple focused contexts instead of one large context
const UserContext = createContext();
const ThemeContext = createContext();
const CartContext = createContext();

function App() {
  return (
    <UserContext.Provider value={userState}>
      <ThemeContext.Provider value={themeState}>
        <CartContext.Provider value={cartState}>
          <MainApp />
        </CartContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

#### Split State and Actions

```jsx
function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo(
    () => ({
      incrementCount: () => dispatch({ type: "INCREMENT" }),
      decrementCount: () => dispatch({ type: "DECREMENT" }),
      resetCount: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  // Provide state and actions separately
  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
}
```

### When to Use Context

- When state needs to be accessed by many components at different nesting levels
- For theme, user authentication, language preferences, etc.
- When you want to avoid excessive prop drilling

## State Management Libraries

For complex applications, third-party state management libraries can be valuable.

### Redux

Redux is a predictable state container that centralizes application state.

#### Core Concepts

- **Store**: Single source of truth for application state
- **Actions**: Objects describing state changes
- **Reducers**: Pure functions that update state based on actions
- **Dispatch**: Method to send actions to the store

#### Basic Implementation

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

The modern way to write Redux with less boilerplate.

#### Key Features

- Simplified store setup
- Built-in immutable updates with Immer
- Automatic action creators
- Simplified reducer logic

#### Implementation

```jsx
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1; // Immer allows "mutating" syntax
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
});

// Export actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Component
function ReduxCounter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}

// App
function App() {
  return (
    <Provider store={store}>
      <ReduxCounter />
    </Provider>
  );
}
```

### Zustand

A minimalist state management solution with a simpler API than Redux.

#### Key Features

- Minimal boilerplate
- No providers needed
- Easy to learn and use
- Supports middleware

#### Implementation

```jsx
import create from "zustand";

// Create store with state and actions
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Use store in components
function Counter() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Jotai

An atomic approach to state management.

#### Key Features

- Atom-based (inspired by Recoil)
- Fine-grained updates
- No context providers needed
- Supports derived state

#### Implementation

```jsx
import { atom, useAtom } from "jotai";

// Define atoms
const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Use atoms in components
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);

  return (
    <div>
      <h1>Count: {count}</h1>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
    </div>
  );
}
```

## Server State Management

Managing data from API calls requires specialized tools.

### React Query

React Query is a library for fetching, caching, and updating server state.

#### Key Features

- Automatic caching
- Background refetching
- Pagination and infinite scroll support
- Mutation helpers

#### Implementation

```jsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "react-query";

// Create client
const queryClient = new QueryClient();

// App with provider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  );
}

// Component using React Query
function TodoApp() {
  // Query - fetch data
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery("todos", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  // Mutation - update data
  const mutation = useMutation(
    (newTodo) => {
      return fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then((response) => response.json());
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("todos");
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos.slice(0, 10).map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          mutation.mutate({
            title: "New Todo",
            completed: false,
            userId: 1,
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}
```

## Choosing the Right Approach

### Factors to Consider

#### Application Size and Complexity

- **Small applications**: Local state and prop drilling
- **Medium applications**: Context API
- **Large applications**: Redux, Zustand, or other state management libraries

#### Component Tree Depth

- **Shallow trees**: Lifting state up is usually sufficient
- **Deep trees**: Context API or state management libraries to avoid prop drilling

#### Team Experience

- Consider the learning curve for your team
- More complex solutions require more training
- Choose tooling that matches your team's expertise

#### Performance Needs

- Context may cause re-renders in large applications
- Libraries like Redux offer more optimization opportunities
- Use memoization for complex or frequently updated state

#### State Persistence Requirements

- Some libraries offer built-in persistence solutions
- Consider how state needs to be restored across sessions

### Decision Framework

1. **Start simple**: Begin with local state
2. **Add complexity gradually**: Move to lifting state up, then Context
3. **Adopt libraries when needed**: Introduce Redux or alternatives when the complexity justifies it
4. **Split by domain**: Use different state management approaches for different parts of your app

## Combining Approaches

### Hybrid State Management

It's common to use multiple approaches in a single application:

```jsx
function App() {
  // Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // Global state with Redux
    <Provider store={store}>
      {/* Theme state with Context */}
      <ThemeProvider>
        <Header />
        <Main />
        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <Footer />
      </ThemeProvider>
    </Provider>
  );
}
```

### Best Practices for Mixed State

- Use local state for UI-specific concerns
- Use Context for theme, authentication, and other app-wide settings
- Use Redux or alternatives for complex global state that requires CRUD operations
- Use React Query or similar tools for server-fetched data
