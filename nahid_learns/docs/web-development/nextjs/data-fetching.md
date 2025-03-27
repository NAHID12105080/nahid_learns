---
sidebar_position: 4
---

# Data Fetching in Next.js

Next.js provides several methods for fetching data in your applications. This guide explains the different approaches and when to use each one.

## Server Components (App Router)

With the App Router, React Server Components are the default, allowing you to fetch data directly in your components:

```tsx
// app/users/page.tsx
async function getUsers() {
  const res = await fetch("https://api.example.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Benefits of Server Components for Data Fetching

- No need for useEffect or useState
- Data fetching happens on the server
- Reduced client-side JavaScript
- Improved SEO as content is rendered on the server
- Automatic request deduplication

## fetch() API in Next.js

Next.js extends the native `fetch` API with additional features:

```tsx
// Revalidate data every 60 seconds
fetch("https://api.example.com/data", { next: { revalidate: 60 } });

// Force dynamic fetch (no caching)
fetch("https://api.example.com/data", { cache: "no-store" });

// Default: cached indefinitely
fetch("https://api.example.com/data");
```

## Client Components

For data that needs to be fetched on the client:

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return <div>{/* Render data */}</div>;
}
```

## API Routes

Next.js allows you to create API endpoints within your application:

```tsx
// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.example.com/users");
  const data = await res.json();

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Process the data, e.g., save to database

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
```

## Static vs. Dynamic Data Fetching

Choose between static and dynamic data fetching based on your needs:

- **Static Data**: Use when data doesn't change frequently
- **Dynamic Data**: Use when data changes often or is user-specific

## Advanced Patterns

### Parallel Data Fetching

```tsx
async function UsersPage() {
  // These requests run in parallel
  const usersPromise = fetch("/api/users");
  const postsPromise = fetch("/api/posts");

  const [usersResponse, postsResponse] = await Promise.all([
    usersPromise,
    postsPromise,
  ]);

  const users = await usersResponse.json();
  const posts = await postsResponse.json();

  // Render with both datasets
}
```

### Sequential Data Fetching

```tsx
async function UserWithPosts({ userId }) {
  // First fetch the user
  const userResponse = await fetch(`/api/users/${userId}`);
  const user = await userResponse.json();

  // Then use the user data to fetch their posts
  const postsResponse = await fetch(`/api/users/${user.id}/posts`);
  const posts = await postsResponse.json();

  // Render with both datasets
}
```

Mastering data fetching in Next.js is essential for building performant, SEO-friendly applications.
