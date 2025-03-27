---
sidebar_position: 6
---

# React Security Best Practices

Security is a critical aspect of web application development. This guide covers best practices for building secure React applications.

## Common Security Vulnerabilities

### Cross-Site Scripting (XSS)

XSS attacks occur when malicious scripts are injected into your application and executed in users' browsers.

React automatically escapes content before rendering, making it resistant to most XSS attacks:

```jsx
// Safe: React escapes this content automatically
function Comment({ data }) {
  return <div>{data.comment}</div>;
}
```

However, there are still ways XSS can occur in React applications:

```jsx
// UNSAFE: dangerouslySetInnerHTML bypasses React's automatic escaping
function Comment({ data }) {
  return <div dangerouslySetInnerHTML={{ __html: data.comment }} />;
}
```

**Best practices:**

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

### Cross-Site Request Forgery (CSRF)

CSRF attacks trick authenticated users into performing unintended actions.

**Best practices:**

1. Use anti-CSRF tokens with your backend API
2. Use proper authentication mechanisms like JWT or OAuth
3. Set appropriate cookie flags (HttpOnly, SameSite, Secure)

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

### Injection Attacks

Injection attacks occur when untrusted data is sent to an interpreter.

**Best practices:**

1. Never pass user input directly to APIs without validation
2. Use parameterized queries for database operations
3. Validate and sanitize all user inputs

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

**Best practices:**

1. Don't store sensitive data in local/session storage (it's not encrypted)
2. Clear sensitive data from memory when no longer needed
3. Consider using secure HTTP-only cookies for sensitive data

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

### Redux Security

If you're using Redux, follow these additional practices:

1. Don't put sensitive data in Redux store (it can be accessed via Redux DevTools)
2. Use middleware to prevent storing sensitive data
3. Consider using Redux-persist with encryption for persisted state

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

## Authentication and Authorization

### Secure Authentication Practices

1. Use well-established authentication libraries and services
2. Implement proper token validation
3. Set appropriate token expiration times
4. Use refresh tokens for long-lived sessions

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

### Route Protection

Protect routes that require authentication:

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

## API Security

### Secure API Calls

1. Use HTTPS for all API requests
2. Implement proper error handling
3. Validate API responses
4. Set up request timeouts

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

### API Keys and Secrets

Never expose API keys or secrets in your client-side code:

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

## Form Security

### Input Validation

Always validate user inputs both on the client and server:

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

### HTTPS and Secure Forms

1. Always use HTTPS for form submissions
2. Set proper secure and SameSite cookie attributes
3. Implement CSRF protection

## Dependency Security

### Keeping Dependencies Updated

Outdated dependencies may contain security vulnerabilities:

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

### Using Content Security Policy (CSP)

CSP helps prevent XSS and other code injection attacks:

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

## Environment Variables

### Secure Usage of Environment Variables

1. Use `.env` files for environment variables
2. Only expose variables prefixed with `REACT_APP_` (in Create React App)
3. Don't store secrets in client-accessible variables

```jsx
// .env file
REACT_APP_API_URL=https://api.example.com
BACKEND_API_KEY=supersecret  # This won't be accessible in the React app

// Usage in React
function api() {
  return fetch(`${process.env.REACT_APP_API_URL}/data`);
}
```

## Production Deployment Security

### Build and Deployment Best Practices

1. Use source maps cautiously in production (they expose source code)
2. Enable HTTPS
3. Set up proper security headers
4. Implement monitoring and error tracking

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

## Security Checklist

Use this checklist to ensure your React application follows security best practices:

- [ ] Use HTTPS everywhere
- [ ] Implement proper authentication and authorization
- [ ] Sanitize all user inputs
- [ ] Avoid `dangerouslySetInnerHTML` or use it with sanitization
- [ ] Keep dependencies updated
- [ ] Don't store sensitive data in localStorage or sessionStorage
- [ ] Set up proper CSP headers
- [ ] Implement CSRF protection
- [ ] Validate and sanitize data on both client and server
- [ ] Don't expose API keys or secrets in client code
- [ ] Use secure cookie settings (HttpOnly, Secure, SameSite)
- [ ] Implement proper error handling

## Security Testing Tools

Consider using these tools to test your application's security:

1. **OWASP ZAP**: For finding vulnerabilities in your web application
2. **Lighthouse**: For security and best practice audits
3. **Snyk**: For finding vulnerabilities in dependencies
4. **ESLint security plugins**: For catching security issues in your code

By following these security best practices, you can build React applications that are more resilient to common security threats and provide a safer experience for your users.
