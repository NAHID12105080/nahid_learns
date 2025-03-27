---
sidebar_position: 5
---

# Testing React Applications

Effective testing ensures your React applications work as expected and helps prevent regressions. This guide covers different testing approaches and tools for React applications.

## Types of Tests

### Unit Tests

Unit tests verify that individual components or functions work correctly in isolation:

```jsx
// Button.js
export function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

// Button.test.js
import { render, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

test("calls onClick when clicked", () => {
  const handleClick = jest.fn();
  const { getByText } = render(<Button onClick={handleClick}>Click Me</Button>);

  fireEvent.click(getByText("Click Me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly:

```jsx
// Form.js
function Form({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

// Form.test.js
test("submits the form with user input", () => {
  const handleSubmit = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <Form onSubmit={handleSubmit} />
  );

  fireEvent.change(getByPlaceholderText("Enter name"), {
    target: { value: "John Doe" },
  });

  fireEvent.click(getByText("Submit"));

  expect(handleSubmit).toHaveBeenCalledWith({ name: "John Doe" });
});
```

### End-to-End Tests

E2E tests verify that entire user flows work correctly by simulating user behavior:

```javascript
// Using Cypress
describe("Authentication Flow", () => {
  it("allows users to log in", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, User").should("be.visible");
  });
});
```

## Testing Libraries and Tools

### Jest

Jest is a JavaScript testing framework commonly used with React:

```bash
npm install --save-dev jest
```

Jest provides:

- Test runner
- Assertion library
- Mocking utilities
- Code coverage reports

### React Testing Library

React Testing Library encourages testing components as users would interact with them:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Key concepts:

- Queries (getBy, findBy, queryBy)
- User events
- Assertions on accessibility and visibility

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Counter } from "./Counter";

test("counter increments when button is clicked", () => {
  render(<Counter initialCount={0} />);

  expect(screen.getByText("Count: 0")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Increment" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### Testing Hooks

Test custom hooks with `@testing-library/react-hooks`:

```jsx
// useCounter.js
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return { count, increment, decrement };
}

// useCounter.test.js
import { renderHook, act } from "@testing-library/react-hooks";
import { useCounter } from "./useCounter";

test("should increment counter", () => {
  const { result } = renderHook(() => useCounter(0));

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Testing Context Providers

When testing components that use context:

```jsx
// ThemeContext.js
export const ThemeContext = createContext("light");

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ThemeButton.test.js
test("uses theme from context", () => {
  render(
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );

  const button = screen.getByRole("button");
  expect(button).toHaveClass("theme-light");
});
```

## Mocking

### Mocking Functions

```jsx
test("calls API on button click", () => {
  const mockFetchData = jest.fn();
  render(<DataFetcher fetchData={mockFetchData} />);

  fireEvent.click(screen.getByText("Fetch Data"));

  expect(mockFetchData).toHaveBeenCalledTimes(1);
});
```

### Mocking Modules

```jsx
// mocked axios
jest.mock("axios");

test("fetches and displays data", async () => {
  const mockData = { name: "John Doe" };
  axios.get.mockResolvedValueOnce({ data: mockData });

  render(<UserProfile userId="1" />);

  expect(axios.get).toHaveBeenCalledWith("/api/users/1");

  const userName = await screen.findByText("John Doe");
  expect(userName).toBeInTheDocument();
});
```

### Mocking Components

```jsx
jest.mock("./ComplexComponent", () => {
  return function MockedComplexComponent(props) {
    return <div data-testid="mocked-complex">Mocked: {props.name}</div>;
  };
});

test("renders with mocked complex component", () => {
  render(<Parent />);
  expect(screen.getByTestId("mocked-complex")).toBeInTheDocument();
});
```

## Testing Asynchronous Code

### Testing Promises

```jsx
test("loads data on mount", async () => {
  render(<DataLoader />);

  // Initially shows loading state
  expect(screen.getByText("Loading...")).toBeInTheDocument();

  // Wait for data to load
  const data = await screen.findByText("Data loaded");
  expect(data).toBeInTheDocument();
});
```

### Testing Error States

```jsx
test("shows error when API fails", async () => {
  // Mock the API to reject
  axios.get.mockRejectedValueOnce(new Error("API Error"));

  render(<DataLoader />);

  // Wait for error message
  const error = await screen.findByText("Error loading data");
  expect(error).toBeInTheDocument();
});
```

## Test Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it
2. **Use accessibility queries** - Prefer queries like `getByRole` over `getByTestId`
3. **Avoid testing implementation details** - Don't test state directly
4. **Write maintainable tests** - Tests should not break when implementation changes
5. **Test edge cases** - Empty states, error states, boundary conditions
6. **Keep tests simple** - One assertion per test is often clearer
7. **Create test utilities** - For common test setup and patterns

## Testing Workflows

### Test-Driven Development (TDD)

1. Write a failing test for the functionality you want to implement
2. Implement the code to make the test pass
3. Refactor the code while keeping tests passing

```jsx
// 1. Write failing test
test("increments counter when Increment button is clicked", () => {
  render(<Counter />);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Increment"));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});

// 2. Implement code to make it pass
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

### Continuous Integration

Set up testing in CI/CD pipelines to run tests on every commit:

```yaml
# Example GitHub Actions workflow
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"
      - run: npm ci
      - run: npm test
```

## Specialized Testing

### Snapshot Testing

Capture rendered output for regression testing:

```jsx
test("renders correctly", () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();
});
```

### Visual Regression Testing

Test UI appearance with tools like Storybook and Chromatic:

```jsx
// Button.stories.js
export default {
  title: "Components/Button",
  component: Button,
};

export const Primary = () => <Button variant="primary">Primary Button</Button>;
export const Secondary = () => (
  <Button variant="secondary">Secondary Button</Button>
);
```

### Performance Testing

Test performance characteristics:

```jsx
test("renders list efficiently", async () => {
  performance.mark("start-render");

  render(<LargeList items={generateItems(1000)} />);

  performance.mark("end-render");
  performance.measure("render-time", "start-render", "end-render");

  const measurements = performance.getEntriesByName("render-time");
  expect(measurements[0].duration).toBeLessThan(100);
});
```

By implementing a comprehensive testing strategy using these techniques, you can build more reliable and maintainable React applications with confidence that they work as expected.
