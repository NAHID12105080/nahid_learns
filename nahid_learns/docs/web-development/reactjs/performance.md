---
sidebar_position: 4
---

# React Performance Optimization

Optimizing React applications is crucial for providing a smooth user experience. This guide covers techniques to improve the performance of your React applications.

## Component Rendering Optimization

### React.memo

Memoize functional components to prevent unnecessary re-renders:

```jsx
import { memo } from "react";

const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  // Component logic
  return <div>{/* Render content */}</div>;
});
```

Use `memo` when a component renders the same result given the same props and doesn't depend on any state or context changes.

### PureComponent for Class Components

For class components, extend `PureComponent` instead of `Component`:

```jsx
import { PureComponent } from "react";

class ExpensiveComponent extends PureComponent {
  render() {
    return <div>{/* Render content */}</div>;
  }
}
```

`PureComponent` performs a shallow comparison of props and state to determine if a re-render is needed.

## Memoization Hooks

### useMemo

Memoize expensive calculations to avoid recomputing on every render:

```jsx
import { useMemo, useState } from "react";

function FilteredList({ items, filter }) {
  const filteredItems = useMemo(() => {
    console.log("Filtering items...");
    return items.filter((item) => item.includes(filter));
  }, [items, filter]); // Only recompute when items or filter changes

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### useCallback

Memoize callback functions to maintain referential equality:

```jsx
import { useCallback, useState } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);

  // This function maintains the same reference across renders
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]); // Only changes when count changes

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

This is especially important when passing callbacks to optimized child components.

## List Rendering Optimization

### Virtualization

For long lists, use virtualization to render only visible items:

```jsx
import { useState } from "react";
import { FixedSizeList } from "react-window";

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>Item {items[index]}</div>
  );

  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

Libraries like `react-window` and `react-virtualized` help with efficient rendering of large lists.

### Key Optimization

Always use stable, unique keys for list items:

```jsx
// Good: Using a unique ID
function GoodList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Bad: Using index as key in a dynamic list
function BadList({ users }) {
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user.name}</li>
      ))}
    </ul>
  );
}
```

Using array indices as keys can cause issues with item reordering and state persistence.

## Code Splitting

Split your JavaScript bundle into smaller chunks that load on demand:

### Dynamic Imports

```jsx
import { lazy, Suspense } from "react";

// Instead of: import ExpensiveComponent from './ExpensiveComponent';
const ExpensiveComponent = lazy(() => import("./ExpensiveComponent"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExpensiveComponent />
      </Suspense>
    </div>
  );
}
```

### Route-Based Code Splitting

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## State and Context Optimization

### State Colocation

Keep state as close as possible to where it's used:

```jsx
// Bad: State too high in the tree
function BadParent() {
  const [value, setValue] = useState("");
  return (
    <div>
      <SomeComponent />
      <OtherComponent />
      <ChildWithInput value={value} onChange={setValue} />
    </div>
  );
}

// Good: State colocated with the component that uses it
function GoodParent() {
  return (
    <div>
      <SomeComponent />
      <OtherComponent />
      <ChildWithInput />
    </div>
  );
}

function ChildWithInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Context Splitting

Split contexts to avoid unnecessary re-renders:

```jsx
// Instead of one large context
const AppContext = createContext();

// Split into focused contexts
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationsContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <NotificationsContext.Provider
          value={{ notifications, setNotifications }}
        >
          <Main />
        </NotificationsContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

## Rendering and useEffect Optimization

### Conditional Rendering

Be careful with conditional rendering to avoid unnecessary mounting/unmounting:

```jsx
// Less efficient: Completely different trees
function LessEfficient({ isLoggedIn }) {
  return isLoggedIn ? <LoggedInView /> : <LoggedOutView />;
}

// More efficient: Same structure with conditional content
function MoreEfficient({ isLoggedIn }) {
  return (
    <div className="app-view">
      <Header />
      <main>{isLoggedIn ? <LoggedInContent /> : <LoggedOutContent />}</main>
      <Footer />
    </div>
  );
}
```

### Optimization of useEffect Dependencies

Carefully manage dependencies in useEffect to prevent unnecessary effect runs:

```jsx
const [name, setName] = useState("");
const [age, setAge] = useState(0);

// Bad: Object literal in dependencies
useEffect(() => {
  fetchUserData({ name, age });
}, [{ name, age }]); // New reference every render!

// Good: Primitive dependencies
useEffect(() => {
  fetchUserData({ name, age });
}, [name, age]); // Only runs when name or age changes
```

## Measuring Performance

### React DevTools Profiler

Use the React DevTools Profiler to identify render bottlenecks:

1. Record a user interaction session
2. Look for frequently rendering components
3. Check render durations
4. Examine component commit details

### Performance API

Measure specific operations using the browser's Performance API:

```jsx
function ExpensiveOperation() {
  const handleClick = () => {
    const startTime = performance.now();

    // Expensive operation
    const result = someExpensiveCalculation();

    const endTime = performance.now();
    console.log(`Operation took ${endTime - startTime}ms`);

    return result;
  };

  return <button onClick={handleClick}>Perform Operation</button>;
}
```

## General Best Practices

1. **Avoid anonymous functions in renders** - They create new functions on each render
2. **Debounce or throttle fast-changing events** - Especially for resize or scroll handlers
3. **Use production builds** - Development builds are significantly slower
4. **Implement progressive loading** - Load essential content first, then enhance
5. **Consider server-side rendering** - For faster initial page loads and improved SEO
6. **Use web workers** for CPU-intensive tasks

By applying these optimization techniques strategically, you can significantly improve the performance of your React applications, creating a smoother and more responsive user experience.
