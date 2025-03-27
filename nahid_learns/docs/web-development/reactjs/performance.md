---
sidebar_position: 4
---

# React Performance Optimization

Optimizing React applications is crucial for providing a smooth user experience. This guide covers techniques to improve the performance of your React applications.

## Component Rendering Optimization

### React.memo

Memoize functional components to prevent unnecessary re-renders.

#### When to Use

- For pure functional components that render the same output given the same props
- When a component re-renders frequently due to parent updates
- For expensive component renders that don't depend on context

#### Implementation

```jsx
import { memo } from "react";

const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  // Component logic
  return <div>{/* Render content */}</div>;
});
```

#### Custom Comparison

```jsx
const areEqual = (prevProps, nextProps) => {
  // Return true if passing nextProps to render would return
  // the same result as passing prevProps to render,
  // otherwise return false
  return prevProps.id === nextProps.id && prevProps.name === nextProps.name;
};

const MemoizedComponent = memo(SomeComponent, areEqual);
```

### PureComponent for Class Components

For class components, extend `PureComponent` instead of `Component`.

#### When to Use

- For class components that should only update when props or state change
- When implementing `shouldComponentUpdate` would be tedious
- To automatically perform shallow comparison of props and state

#### Implementation

```jsx
import { PureComponent } from "react";

class ExpensiveComponent extends PureComponent {
  render() {
    return <div>{/* Render content */}</div>;
  }
}
```

## Memoization Hooks

### useMemo

Memoize expensive calculations to avoid recomputing on every render.

#### When to Use

- For computationally expensive calculations
- When derived values depend on props or state that don't change often
- For creating objects that should maintain referential equality

#### Implementation

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

#### Optimizing Object Creation

```jsx
// Without useMemo - creates a new object every render
function Component({ id }) {
  const config = { id, version: "v1", feature: true };
  // ...
}

// With useMemo - maintains object reference
function OptimizedComponent({ id }) {
  const config = useMemo(
    () => ({
      id,
      version: "v1",
      feature: true,
    }),
    [id]
  );
  // ...
}
```

### useCallback

Memoize callback functions to maintain referential equality.

#### When to Use

- When passing callbacks to optimized child components
- For dependencies in useEffect to prevent unnecessary effect runs
- When the function creation itself is expensive

#### Implementation

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

#### With Dependencies

```jsx
// Correctly capturing dependencies
function SearchComponent({ query, fetchResults }) {
  const handleSearch = useCallback(() => {
    const results = fetchResults(query);
    // process results...
  }, [query, fetchResults]);

  // ...
}
```

## List Rendering Optimization

### Virtualization

For long lists, use virtualization to render only visible items.

#### Benefits

- Dramatically improves performance with large lists
- Reduces DOM nodes and memory usage
- Improves initial load time
- Maintains smooth scrolling

#### Implementation with react-window

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

#### Variable Size Lists

```jsx
import { VariableSizeList } from "react-window";

function VariableHeightList({ items }) {
  // Calculate height for each item
  const getItemSize = (index) => {
    return items[index].content.length > 50 ? 60 : 30;
  };

  const Row = ({ index, style }) => (
    <div style={style}>{items[index].content}</div>
  );

  return (
    <VariableSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  );
}
```

### Key Optimization

Always use stable, unique keys for list items.

#### Best Practices

- Use unique IDs from your data when available
- Avoid using array index as key for dynamic lists
- Generate stable keys when necessary

#### Examples

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

#### Why Keys Matter

1. Keys help React identify which items have changed, been added, or removed
2. Keys should be unique among siblings
3. Keys affect element identity and state preservation

## Code Splitting

Split your JavaScript bundle into smaller chunks that load on demand.

### Dynamic Imports

#### Benefits

- Reduces initial load time
- Loads components only when needed
- Improves time-to-interactive

#### Implementation

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

#### Implementation with React Router

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

#### Preloading Routes

```jsx
const About = lazy(() => import("./About"));

// Preload the component when user hovers over the link
function AboutLink() {
  const handleMouseEnter = () => {
    // Preload the About component
    import("./About");
  };

  return (
    <Link to="/about" onMouseEnter={handleMouseEnter}>
      About
    </Link>
  );
}
```

## State and Context Optimization

### State Colocation

Keep state as close as possible to where it's used.

#### Benefits

- Reduces unnecessary re-renders
- Improves component isolation
- Makes code more maintainable

#### Implementation

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

Split contexts to avoid unnecessary re-renders.

#### Benefits

- Limits the scope of re-renders when context values change
- Improves component isolation
- Makes code more maintainable

#### Implementation

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

### Context Consumer Optimization

```jsx
// Optimizing context consumers with memoization
const ThemeContext = createContext({ theme: "light" });

// This component only re-renders when the theme changes
const ThemedButton = memo(() => {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
});

// This component has its own state but won't re-render when theme changes
function UserProfile() {
  const [user, setUser] = useState(null);

  // Pass the ThemedButton as a child instead of rendering it directly
  return (
    <div>
      <h1>User Profile</h1>
      <input
        value={user?.name || ""}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <ThemedButton />
    </div>
  );
}
```

## Rendering and useEffect Optimization

### Conditional Rendering

Be careful with conditional rendering to avoid unnecessary mounting/unmounting.

#### Implementation

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

Carefully manage dependencies in useEffect to prevent unnecessary effect runs.

#### Common Mistakes

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

#### Using Refs to Skip Effects

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Store the previous query to avoid unnecessary fetches
  const prevQueryRef = useRef("");

  useEffect(() => {
    // Skip the effect if the query hasn't changed
    if (query === prevQueryRef.current) return;

    prevQueryRef.current = query;

    // Now perform the search
    setIsLoading(true);
    searchApi(query).then((data) => {
      setResults(data);
      setIsLoading(false);
    });
  }, [query]);

  // Rest of component...
}
```

## Measuring Performance

### React DevTools Profiler

Use the React DevTools Profiler to identify render bottlenecks.

#### How to Use

1. Install React DevTools browser extension
2. Open DevTools and go to the "Profiler" tab
3. Click record and interact with your application
4. Analyze the flamegraph to identify slow components

#### What to Look For

- Components that render frequently
- Slow rendering components
- Cascading renders (where one component triggers many others)

### Performance API

Measure specific operations using the browser's Performance API.

#### Implementation

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

#### Custom Performance Hook

```jsx
function usePerformanceTracker(operationName) {
  useEffect(() => {
    performance.mark(`${operationName}-start`);

    return () => {
      performance.mark(`${operationName}-end`);
      performance.measure(
        operationName,
        `${operationName}-start`,
        `${operationName}-end`
      );

      const measures = performance.getEntriesByName(operationName);
      console.log(`${operationName} took ${measures[0].duration}ms`);
    };
  }, [operationName]);
}

// Usage
function ExpensiveComponent() {
  usePerformanceTracker("ExpensiveComponent-render");
  // Component logic...
}
```

## Advanced Optimization Techniques

### Web Workers

Offload CPU-intensive operations to a separate thread.

```jsx
// worker.js
self.addEventListener("message", (e) => {
  // Perform expensive calculation
  const result = performExpensiveCalculation(e.data);
  self.postMessage(result);
});

// Component using web worker
function WebWorkerComponent() {
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    const worker = new Worker("./worker.js");

    worker.postMessage(/* data for calculation */);
    worker.onmessage = (e) => {
      setResult(e.data);
      setIsCalculating(false);
      worker.terminate();
    };
  };

  return (
    <div>
      <button onClick={handleCalculate} disabled={isCalculating}>
        {isCalculating ? "Calculating..." : "Calculate"}
      </button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
```

### React.lazy and Suspense for Data Fetching

```jsx
// Create a resource
function createResource(asyncFn) {
  let status = "pending";
  let result;
  const promise = asyncFn()
    .then((r) => {
      status = "success";
      result = r;
    })
    .catch((e) => {
      status = "error";
      result = e;
    });

  return {
    read() {
      if (status === "pending") throw promise;
      if (status === "error") throw result;
      return result;
    },
  };
}

// Component using suspense for data
const userResource = createResource(() => fetchUserData());

function UserProfile() {
  const user = userResource.read();
  return <div>{user.name}</div>;
}

// Parent with suspense
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
}
```

## General Best Practices

1. **Avoid anonymous functions in renders** - They create new functions on each render

   ```jsx
   // Bad
   <button onClick={() => handleClick(id)}>Click</button>;

   // Good
   const memoizedHandleClick = useCallback(() => handleClick(id), [id]);
   <button onClick={memoizedHandleClick}>Click</button>;
   ```

2. **Debounce or throttle fast-changing events** - Especially for resize or scroll handlers

   ```jsx
   import { useState, useEffect } from "react";
   import debounce from "lodash.debounce";

   function WindowSize() {
     const [size, setSize] = useState({
       width: window.innerWidth,
       height: window.innerHeight,
     });

     useEffect(() => {
       const handleResize = debounce(() => {
         setSize({
           width: window.innerWidth,
           height: window.innerHeight,
         });
       }, 100);

       window.addEventListener("resize", handleResize);
       return () => window.removeEventListener("resize", handleResize);
     }, []);

     return (
       <div>
         Window size: {size.width} x {size.height}
       </div>
     );
   }
   ```

3. **Use production builds** - Development builds are significantly slower

   ```bash
   # For Create React App
   npm run build
   ```

4. **Implement progressive loading** - Load essential content first, then enhance

   ```jsx
   function App() {
     const [isEnhancedLoaded, setIsEnhancedLoaded] = useState(false);

     useEffect(() => {
       // Load essential content first
       // Then load enhanced features
       const timer = setTimeout(() => {
         setIsEnhancedLoaded(true);
       }, 2000);

       return () => clearTimeout(timer);
     }, []);

     return (
       <div>
         <EssentialContent />
         {isEnhancedLoaded && <EnhancedFeatures />}
       </div>
     );
   }
   ```

5. **Consider server-side rendering** - For faster initial page loads and improved SEO

   ```jsx
   // Using Next.js for SSR
   export async function getServerSideProps() {
     const data = await fetchInitialData();
     return {
       props: { data },
     };
   }

   function Page({ data }) {
     // Render with pre-fetched data
     return <div>{/* render content */}</div>;
   }
   ```

By applying these optimization techniques strategically, you can significantly improve the performance of your React applications, creating a smoother and more responsive user experience.
