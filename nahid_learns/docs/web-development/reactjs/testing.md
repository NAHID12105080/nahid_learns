---
sidebar_position: 5
---

# Testing React Applications

Effective testing ensures your React applications work as expected and helps prevent regressions. This guide covers different testing approaches and tools for React applications.

## Types of Tests

### Unit Tests

Unit tests verify that individual components or functions work correctly in isolation.

#### What to Test

- Component rendering
- User interactions
- State changes
- Event handlers
- Utility functions

#### Example

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

#### Benefits

- Fast to run
- Focused scope
- Easier to debug
- Provides high confidence in component behavior

### Integration Tests

Integration tests verify that multiple components work together correctly.

#### What to Test

- Component interactions
- Data flow between components
- Form submissions
- API responses handling
- Route transitions

#### Example

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

#### Benefits

- Tests component relationships
- Identifies interface issues
- More realistic user scenarios
- Provides confidence in feature functionality

### End-to-End Tests

E2E tests verify that entire user flows work correctly by simulating user behavior.

#### What to Test

- User journeys (login, signup, checkout, etc.)
- Navigation flows
- Data persistence across pages
- Browser interactions

#### Example with Cypress

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

#### Benefits

- Tests entire application workflows
- Closest to real user experience
- Captures browser-specific issues
- Validates production-ready features

## Testing Libraries and Tools

### Jest

Jest is a JavaScript testing framework commonly used with React.

#### Installation

```bash
npm install --save-dev jest
```

#### Key Features

- Test runner
- Assertion library
- Mocking utilities
- Code coverage reports
- Snapshot testing

#### Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.{js,jsx,ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
```

### React Testing Library

React Testing Library encourages testing components as users would interact with them.

#### Installation

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

#### Key Concepts

- Queries (getBy, findBy, queryBy)
- User events
- Assertions on accessibility and visibility

#### Example

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

#### Best Practices

- Test behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Focus on user perspective
- Test realistic user interactions

### Testing Hooks

Test custom hooks with `@testing-library/react-hooks`.

#### Installation

```bash
npm install --save-dev @testing-library/react-hooks
```

#### Example

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

#### Testing Complex Hooks

```jsx
// useDataFetching.test.js
test("should fetch and update data", async () => {
  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: "test data" }),
  });

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataFetching("https://example.com/api")
  );

  // Initial state
  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBe(null);

  // Wait for the fetch to complete
  await waitForNextUpdate();

  // Updated state
  expect(result.current.loading).toBe(false);
  expect(result.current.data).toEqual({ data: "test data" });
  expect(global.fetch).toHaveBeenCalledWith("https://example.com/api");
});
```

### Testing Context Providers

When testing components that use context:

#### Setup

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

#### Testing Context Consumers

```jsx
// Create a custom render function
function renderWithThemeContext(ui, { theme = "light", ...options } = {}) {
  const setTheme = jest.fn();

  return {
    ...render(
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {ui}
      </ThemeContext.Provider>,
      options
    ),
    setTheme,
  };
}

// Use the custom render
test("theme toggle button changes theme", () => {
  const { getByRole, setTheme } = renderWithThemeContext(<ThemeToggle />);

  fireEvent.click(getByRole("button", { name: /toggle theme/i }));

  expect(setTheme).toHaveBeenCalledWith("dark");
});
```

## Mocking

### Mocking Functions

Mock functions allow you to test the links between code by erasing the actual implementation.

#### Basic Function Mocking

```jsx
test("calls API on button click", () => {
  const mockFetchData = jest.fn();
  render(<DataFetcher fetchData={mockFetchData} />);

  fireEvent.click(screen.getByText("Fetch Data"));

  expect(mockFetchData).toHaveBeenCalledTimes(1);
});
```

#### Mock Implementation

```jsx
test("calculates total with tax", () => {
  // Mock implementation of tax calculator
  const calculateTax = jest.fn().mockImplementation((amount) => amount * 0.1);

  render(<CartTotal calculateTax={calculateTax} subtotal={100} />);

  expect(screen.getByText("Total: $110.00")).toBeInTheDocument();
  expect(calculateTax).toHaveBeenCalledWith(100);
});
```

### Mocking Modules

Mocking entire modules is useful for isolating components from external dependencies.

#### Mocking Axios

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

#### Mocking Custom Modules

```jsx
// Mock a local utility module
jest.mock("../utils/formatter", () => ({
  formatCurrency: jest.fn((amount) => `$${amount}.00`),
  formatDate: jest.fn((date) => "01/01/2023"),
}));

import { formatCurrency } from "../utils/formatter";

test("formats price correctly", () => {
  render(<PriceDisplay value={42} />);

  expect(formatCurrency).toHaveBeenCalledWith(42);
  expect(screen.getByText("$42.00")).toBeInTheDocument();
});
```

### Mocking Components

Mock complex child components to focus on testing parent component behavior.

#### Basic Component Mocking

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

#### Mock with React.memo or forwardRef

```jsx
// Mocking a component that uses React.memo
jest.mock("./MemoizedButton", () => {
  return jest.fn((props) => (
    <button data-testid="mocked-memo-button" onClick={props.onClick}>
      {props.children}
    </button>
  ));
});

import MemoizedButton from "./MemoizedButton";

test("works with memoized component", () => {
  const handleClick = jest.fn();
  render(<MemoizedButton onClick={handleClick}>Click</MemoizedButton>);

  fireEvent.click(screen.getByTestId("mocked-memo-button"));
  expect(handleClick).toHaveBeenCalled();
});
```

## Testing Asynchronous Code

### Testing Promises

Testing code that uses Promises requires waiting for the Promise to resolve.

#### Using findBy Queries

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

#### Using waitFor

```jsx
import { render, screen, waitFor } from "@testing-library/react";

test("updates when async operation completes", async () => {
  render(<AsyncCounter />);

  fireEvent.click(screen.getByText("Increment After Delay"));

  // Wait for the counter to update
  await waitFor(() => {
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

### Testing Error States

Testing error handling is crucial for robust applications.

#### Error Boundaries

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

#### Form Validation Errors

```jsx
test("displays validation errors", async () => {
  render(<SignupForm />);

  // Submit with empty fields
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  // Check for validation errors
  expect(await screen.findByText("Email is required")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
});
```

## Test Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it

   ```jsx
   // Bad - testing implementation details
   test("bad test", () => {
     const { result } = renderHook(() => useState(0));
     act(() => {
       result.current[1](1);
     });
     expect(result.current[0]).toBe(1);
   });

   // Good - testing behavior
   test("good test", () => {
     render(<Counter />);
     fireEvent.click(screen.getByRole("button", { name: /increment/i }));
     expect(screen.getByText("Count: 1")).toBeInTheDocument();
   });
   ```

2. **Use accessibility queries** - Prefer queries like `getByRole` over `getByTestId`

   ```jsx
   // Less maintainable
   const submitButton = screen.getByTestId("submit-button");

   // More maintainable and accessible
   const submitButton = screen.getByRole("button", { name: /submit/i });
   ```

3. **Avoid testing implementation details** - Don't test state directly

   ```jsx
   // Bad - testing internal state
   expect(component.state.count).toBe(1);

   // Good - testing what the user sees
   expect(screen.getByText("Count: 1")).toBeInTheDocument();
   ```

4. **Write maintainable tests** - Tests should not break when implementation changes

5. **Test edge cases** - Empty states, error states, boundary conditions

   ```jsx
   // Test empty state
   test("shows empty message when list is empty", () => {
     render(<List items={[]} />);
     expect(screen.getByText("No items found")).toBeInTheDocument();
   });

   // Test boundary conditions
   test("correctly paginates at exactly 10 items", () => {
     const items = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
     render(<Pagination items={items} itemsPerPage={5} />);
     expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
   });
   ```

6. **Keep tests simple** - One assertion per test is often clearer

7. **Create test utilities** - For common test setup and patterns

   ```jsx
   // Test utility for form testing
   function fillAndSubmitForm(fields) {
     for (const [name, value] of Object.entries(fields)) {
       fireEvent.change(screen.getByLabelText(name), { target: { value } });
     }
     fireEvent.click(screen.getByRole("button", { name: /submit/i }));
   }

   test("submits form correctly", () => {
     render(<ContactForm onSubmit={mockSubmit} />);

     fillAndSubmitForm({
       Name: "John Doe",
       Email: "john@example.com",
       Message: "Hello world",
     });

     expect(mockSubmit).toHaveBeenCalledWith({
       name: "John Doe",
       email: "john@example.com",
       message: "Hello world",
     });
   });
   ```

## Testing Workflows

### Test-Driven Development (TDD)

TDD is a development process that relies on the repetition of a short development cycle.

#### TDD Process

1. Write a failing test for the functionality you want to implement
2. Implement the code to make the test pass
3. Refactor the code while keeping tests passing

#### Example

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

Set up testing in CI/CD pipelines to run tests on every commit.

#### GitHub Actions Workflow

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

#### Benefits of CI Testing

- Catches errors early
- Prevents broken code from merging
- Maintains test discipline across the team
- Creates a quality gate for deployments

## Specialized Testing

### Snapshot Testing

Capture rendered output for regression testing.

#### Implementation

```jsx
test("renders correctly", () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();
});
```

#### Best Practices

- Use snapshots sparingly
- Keep snapshots small and focused
- Review snapshot diffs carefully
- Don't use snapshots as your only form of testing

### Visual Regression Testing

Test UI appearance with tools like Storybook and Chromatic.

#### Storybook Setup

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

#### Testing with Chromatic

```bash
# Install Chromatic
npm install --save-dev chromatic

# Run visual tests
npx chromatic --project-token=your-project-token
```

### Performance Testing

Test performance characteristics of your components.

#### Basic Performance Test

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

#### React Profiler API

```jsx
// Performance testing with React Profiler
import { Profiler } from "react";

function onRenderCallback(
  id, // the "id" prop of the Profiler tree
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time for the entire subtree
  startTime, // when React began rendering
  commitTime // when React committed the updates
) {
  console.log(`Component ${id} took ${actualDuration}ms to render`);
}

// In your test
test("component renders efficiently", () => {
  render(
    <Profiler id="test-component" onRender={onRenderCallback}>
      <ComponentUnderTest />
    </Profiler>
  );

  // Trigger updates and measure performance
});
```

## Setting Up a Testing Environment

### Basic Setup with Create React App

Create React App comes with Jest and Testing Library pre-configured:

```bash
npx create-react-app my-app --template typescript
cd my-app
npm test
```

### Manual Setup

For custom projects, install and configure testing tools:

```bash
# Install core packages
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Create configuration files
# jest.config.js
# jest.setup.js
```

### Setup with Next.js

Next.js requires additional configuration:

```bash
# Install dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create jest.config.js
```

```javascript
// jest.config.js for Next.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Path to Next.js app
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
```

By implementing a comprehensive testing strategy using these techniques, you can build more reliable and maintainable React applications with confidence that they work as expected.
