---
sidebar_position: 6
---

# React Security Best Practices

Security is a critical aspect of web application development. This guide covers best practices for building secure React applications.

## Common Security Vulnerabilities

### Cross-Site Scripting (XSS)

XSS attacks occur when malicious scripts are injected into your application and executed in users' browsers.

#### React's Built-in Protection

React automatically escapes content before rendering, making it resistant to most XSS attacks:

```jsx
// Safe: React escapes this content automatically
function Comment({ data }) {
  return <div>{data.comment}</div>;
}
```

#### Dangerous Patterns

However, there are still ways XSS can occur in React applications:

```jsx
// UNSAFE: dangerouslySetInnerHTML bypasses React's automatic escaping
function Comment({ data }) {
  return <div dangerouslySetInnerHTML={{ __html: data.comment }} />;
}
```

#### Best Practices

1. Avoid `dangerouslySetInnerHTML` whenever possible
2. If you must use it, sanitize the HTML first with a library like DOMPurify:

```jsx
import DOMPurify from "dompurify";

function SafeHTML({ html }) {
  const sanitizedHTML = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}
```

3. Don't use user input directly in:
   - `href` attributes without validation
   - `style` objects
   - `eval()` or similar functions

#### Safe URL Handling

```jsx
// Unsafe URL handling
function UnsafeLink({ userProvidedUrl }) {
  return <a href={userProvidedUrl}>Click me</a>;
}

// Safe URL handling
function SafeLink({ userProvidedUrl }) {
  // Validate URL format and protocol
  const isValid = /^https?:\/\//.test(userProvidedUrl);
  const url = isValid ? userProvidedUrl : "#";

  return <a href={url}>Click me</a>;
}
```

### Cross-Site Request Forgery (CSRF)

CSRF attacks trick authenticated users into performing unintended actions.

#### Protection Strategies

1. Use anti-CSRF tokens with your backend API
2. Use proper authentication mechanisms like JWT or OAuth
3. Set appropriate cookie flags (HttpOnly, SameSite, Secure)

#### Implementation Example

```jsx
// Example of sending a CSRF token with API requests
function useApiRequest() {
  const makeRequest = async (url, method, data) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include", // Send cookies with the request
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  return { makeRequest };
}
```

#### Modern Protection

```jsx
// Modern CSRF protection with SameSite cookies
// In your server-side code:
// Set-Cookie: sessionid=abc123; Path=/; HttpOnly; Secure; SameSite=Strict
```

### Injection Attacks

Injection attacks occur when untrusted data is sent to an interpreter.

#### Common Vectors

1. SQL injection in backend APIs
2. Command injection in Node.js applications
3. Template injection in JSX
4. GraphQL injection

#### Best Practices

1. Never pass user input directly to APIs without validation
2. Use parameterized queries for database operations
3. Validate and sanitize all user inputs

#### Example: GraphQL Queries

```jsx
// UNSAFE: Direct use of user input in GraphQL query
function UnsafeSearch({ query }) {
  const QUERY = `
    query Search {
      search(term: "${query}") {
        id
        title
      }
    }
  `;
  // ...
}

// SAFE: Using variables in GraphQL
function SafeSearch({ query }) {
  const QUERY = `
    query Search($term: String!) {
      search(term: $term) {
        id
        title
      }
    }
  `;

  const variables = { term: query };
  // Use variables in your request
}
```

## Secure State Management

### Sensitive Data in State

Be careful with sensitive data in your application state.

#### Security Risks

- Local/session storage is readable by JavaScript in the same origin
- React state is accessible via React DevTools
- Memory can persist longer than expected

#### Best Practices

1. Don't store sensitive data in local/session storage (it's not encrypted)
2. Clear sensitive data from memory when no longer needed
3. Consider using secure HTTP-only cookies for sensitive data

#### Implementation Example

```jsx
// UNSAFE: Storing sensitive data in localStorage
const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

// BETTER: Store an encrypted version or reference ID
// and use HTTP-only cookies for the actual sensitive data
const saveTokenReference = (tokenRef) => {
  localStorage.setItem("tokenRef", tokenRef);
};
```

#### Clearing Sensitive Data

```jsx
// Clean up sensitive data when component unmounts
function CreditCardForm() {
  const [cardNumber, setCardNumber] = useState("");

  // Process payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await processPayment(cardNumber);
      // Clear sensitive data immediately after use
      setCardNumber("");
    } catch (error) {
      // Handle error
    }
  };

  // Clean up if component unmounts during transaction
  useEffect(() => {
    return () => {
      // Clear sensitive data on unmount
      setCardNumber("");
    };
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Card number"
      />
      <button type="submit">Pay</button>
    </form>
  );
}
```

### Redux Security

If you're using Redux, follow these additional practices.

#### Security Concerns

- Redux DevTools expose the entire state
- Persistence may store sensitive data
- Middleware can access all actions and state

#### Best Practices

1. Don't put sensitive data in Redux store (it can be accessed via Redux DevTools)
2. Use middleware to prevent storing sensitive data
3. Consider using Redux-persist with encryption for persisted state

#### Implementation Example

```jsx
// Example Redux sanitizer
const sensitiveDataSanitizer = (state) => {
  if (state.auth && state.auth.password) {
    return {
      ...state,
      auth: {
        ...state.auth,
        password: "***REDACTED***",
      },
    };
  }
  return state;
};

// In your Redux setup
const store = createStore(
  rootReducer,
  composeWithDevTools({
    stateSanitizer: sensitiveDataSanitizer,
  })
);
```

#### Secure Persistence

```jsx
// Redux-persist with encryption
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import encryptTransform from "redux-persist-transform-encrypt";

const encryptor = encryptTransform({
  secretKey: "my-super-secret-key",
  onError: function (error) {
    // Handle the error
  },
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
```

## Authentication and Authorization

### Secure Authentication Practices

Implementing secure authentication is critical for protecting user accounts.

#### Core Principles

1. Use well-established authentication libraries and services
2. Implement proper token validation
3. Set appropriate token expiration times
4. Use refresh tokens for long-lived sessions

#### Implementation Example

```jsx
// Example authentication hook
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setUser(null);
          return;
        }

        // Verify token with backend
        const response = await fetch("/api/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid or expired
          removeAuthToken();
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
```

#### Secure Token Storage

```jsx
// Storing tokens securely
function storeAuthToken(token, refreshToken) {
  // Option 1: HttpOnly cookies (handled by server)

  // Option 2: Memory state (for SPA)
  sessionStorage.setItem("auth_token", token);

  // Option 3: Encrypt before storing in localStorage
  const encryptedRefreshToken = encryptData(refreshToken);
  localStorage.setItem("refresh_token", encryptedRefreshToken);
}
```

### Route Protection

Protect routes that require authentication.

#### Basic Implementation

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/public" element={<PublicPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

#### Role-Based Access Control

```jsx
function RoleBasedRoute({ children, requiredRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = requiredRoles.some((role) =>
    user.roles?.includes(role)
  );

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage
<Route
  path="/admin"
  element={
    <RoleBasedRoute requiredRoles={["admin"]}>
      <AdminPanel />
    </RoleBasedRoute>
  }
/>;
```

## API Security

### Secure API Calls

Making secure API calls is critical for protecting data in transit.

#### Best Practices

1. Use HTTPS for all API requests
2. Implement proper error handling
3. Validate API responses
4. Set up request timeouts

#### Implementation Example

```jsx
async function secureApiCall(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: "include",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}
```

#### Handling Authentication Headers

```jsx
// Authentication header helper
function createAuthApiCall() {
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return async (url, options = {}) => {
    const authHeaders = getAuthHeaders();

    return secureApiCall(url, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    });
  };
}

// Usage
const authApiCall = createAuthApiCall();
const userData = await authApiCall("/api/user/profile");
```

### API Keys and Secrets

Never expose API keys or secrets in your client-side code.

#### Security Risks

- API keys in client code can be extracted
- Browser devtools expose your keys
- Client-side requests can be intercepted

#### Best Practices

```jsx
// UNSAFE: API key exposed in frontend code
function fetchData() {
  return fetch(`https://api.example.com/data?api_key=MY_SECRET_API_KEY`);
}

// BETTER: Call your own backend which securely communicates with the external API
function fetchData() {
  return fetch("/api/proxy/get-data");
}
```

#### Environment Variables in React

```jsx
// .env.local file
REACT_APP_API_URL=https://api.example.com
REACT_APP_PUBLIC_KEY=pk_test_123456 # Publishable key only!

// Usage in React
function api() {
  // Safe to expose the API URL
  const apiUrl = process.env.REACT_APP_API_URL;
  // Safe to expose publishable keys (not secret keys!)
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;

  return fetch(`${apiUrl}/data`, {
    headers: {
      'X-Public-Key': publicKey
    }
  });
}
```

## Form Security

### Input Validation

Always validate user inputs both on the client and server.

#### Client-Side Validation

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Valid email is required";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Submit form
    }
  };

  // Form JSX...
}
```

#### Form Validation Libraries

```jsx
// Using formik and yup for validation
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Required"),
});

function ValidatedForm() {
  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        // Handle form submission
      }}
    >
      {/* Form fields */}
    </Formik>
  );
}
```

### HTTPS and Secure Forms

Ensure all forms, especially those handling sensitive data, are submitted securely.

#### Best Practices

1. Always use HTTPS for form submissions
2. Set proper secure and SameSite cookie attributes
3. Implement CSRF protection

#### Form Security Headers

```jsx
// In your Next.js API route handlers
export default function handler(req, res) {
  // Set security headers
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Handle form submission
  // ...
}
```

## Dependency Security

### Keeping Dependencies Updated

Outdated dependencies may contain security vulnerabilities.

#### Monitoring and Updates

1. Regularly update dependencies
2. Use tools like npm audit or Dependabot
3. Review security advisories for your dependencies

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Fix vulnerabilities
npm audit fix
```

#### Automating Security Checks

```yaml
# GitHub workflow for dependency scanning
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 0 * * 0" # Weekly scan

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run npm audit
        run: npm audit --audit-level=high
```

### Using Content Security Policy (CSP)

CSP helps prevent XSS and other code injection attacks.

#### Basic Implementation

```jsx
// Setting CSP in a Next.js application
// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

#### CSP for React Applications

```jsx
// For Create React App, in public/index.html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline' https://trusted-cdn.com;
  img-src 'self' data: https://trusted-cdn.com;
  connect-src 'self' https://api.example.com;
">
```

## Environment Variables

### Secure Usage of Environment Variables

Carefully manage environment variables to avoid exposing secrets.

#### Best Practices

1. Use `.env` files for environment variables
2. Only expose variables prefixed with `REACT_APP_` (in Create React App)
3. Don't store secrets in client-accessible variables

#### Implementation Example

```jsx
// .env file
REACT_APP_API_URL=https://api.example.com
BACKEND_API_KEY=supersecret  # This won't be accessible in the React app

// Usage in React
function api() {
  return fetch(`${process.env.REACT_APP_API_URL}/data`);
}
```

#### Next.js Environment Variables

```jsx
// In Next.js
// .env.local
API_URL=https://api.example.com
API_SECRET=supersecret

// Next.js pages/api/data.js (server-side)
export default async function handler(req, res) {
  // Can access all environment variables
  const response = await fetch(`${process.env.API_URL}/data`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET}`
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}

// pages/index.js (client-side)
export default function Home() {
  // Can only access environment variables prefixed with NEXT_PUBLIC_
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ...
}
```

## Production Deployment Security

### Build and Deployment Best Practices

Follow security best practices when deploying React applications.

#### Source Maps in Production

```javascript
// webpack.config.js (customize for your build tool)
module.exports = {
  mode: "production",
  devtool:
    process.env.NODE_ENV === "production"
      ? false // No source maps in production
      : "eval-source-map", // Source maps in development
  // ...
};
```

#### Security Headers

```jsx
// Example Next.js config with security headers
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

#### Error Handling in Production

```jsx
// Implement a global error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyApplication />
    </ErrorBoundary>
  );
}
```

## Security Checklist

Use this checklist to ensure your React application follows security best practices:

- [ ] **Use HTTPS everywhere**
  - Configure your web server to use HTTPS
  - Redirect HTTP to HTTPS
  - Use HSTS headers
- [ ] **Implement proper authentication and authorization**
  - Use secure auth libraries (Auth0, Firebase Auth, etc.)
  - Implement proper JWT validation
  - Set short expiration times for tokens
- [ ] **Sanitize all user inputs**
  - Sanitize HTML content with DOMPurify
  - Validate inputs on both client and server
  - Use parameterized queries for database operations
- [ ] **Avoid `dangerouslySetInnerHTML` or use it with sanitization**
  - Never pass unsanitized user input to dangerouslySetInnerHTML
  - Always sanitize HTML before using it
- [ ] **Keep dependencies updated**
  - Regularly run npm audit
  - Set up Dependabot or similar services
  - Monitor security advisories
- [ ] **Don't store sensitive data in localStorage or sessionStorage**
  - Use HttpOnly cookies for sensitive data
  - Clear sensitive data when no longer needed
  - Encrypt data if it must be stored client-side
- [ ] **Set up proper CSP headers**
  - Implement a strict Content Security Policy
  - Use nonce-based CSP for inline scripts if needed
  - Test CSP with tools like Google CSP Evaluator
- [ ] **Implement CSRF protection**
  - Use anti-CSRF tokens
  - Implement SameSite cookie attributes
  - Use modern frameworks with built-in CSRF protection
- [ ] **Validate and sanitize data on both client and server**
  - Never trust client-side validation alone
  - Implement server-side validation for all inputs
  - Use validation libraries like Yup or Joi
- [ ] **Don't expose API keys or secrets in client code**
  - Use server-side proxies for third-party API calls
  - Only use environment variables for non-sensitive data
  - Keep secrets in server-side environment variables
- [ ] **Use secure cookie settings (HttpOnly, Secure, SameSite)**
  - Set HttpOnly flag for sensitive cookies
  - Set Secure flag to ensure cookies only sent over HTTPS
  - Set SameSite attribute to prevent CSRF attacks
- [ ] **Implement proper error handling**
  - Use error boundaries in React
  - Don't expose sensitive information in error messages
  - Log errors securely for debugging

## Security Testing Tools

Consider using these tools to test your application's security:

1. **OWASP ZAP**: For finding vulnerabilities in your web application
2. **Lighthouse**: For security and best practice audits
3. **Snyk**: For finding vulnerabilities in dependencies
4. **ESLint security plugins**: For catching security issues in your code

### Setting Up Security Linting

```bash
# Install eslint-plugin-security
npm install --save-dev eslint-plugin-security

# In your .eslintrc.js
module.exports = {
  plugins: ['security'],
  extends: ['plugin:security/recommended'],
  rules: {
    // Additional custom rules
  }
};
```

### Security Scanning with OWASP ZAP

```bash
# Using ZAP in CI pipeline
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://your-staging-app.example.com \
  -r security-report.html
```

By following these security best practices, you can build React applications that are more resilient to common security threats and provide a safer experience for your users.
