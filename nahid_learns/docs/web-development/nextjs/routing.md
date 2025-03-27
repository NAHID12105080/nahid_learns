---
sidebar_position: 3
---

# Routing in Next.js

Next.js provides a file-system based router built on the concept of pages. This guide explores the routing system in Next.js.

## App Router vs Pages Router

Next.js has two routing systems:

1. **App Router** (newer, recommended for new projects)
2. **Pages Router** (traditional approach)

## App Router Basics

The App Router uses the `app` directory (typically `src/app`). The file structure defines your routes:

```
src/app/
├── page.tsx         # Home page (/)
├── about/
│   └── page.tsx     # About page (/about)
├── blog/
│   ├── page.tsx     # Blog index (/blog)
│   └── [slug]/
│       └── page.tsx # Blog post (/blog/post-1)
```

### Key Files

- `page.tsx` - Creates a route and makes it publicly accessible
- `layout.tsx` - Shared UI for a segment and its children
- `loading.tsx` - Loading UI for a segment
- `error.tsx` - Error UI for a segment
- `not-found.tsx` - Not found UI

## Dynamic Routes

For dynamic paths, use square brackets:

```tsx
// src/app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <article>
      <h1>Blog Post: {params.slug}</h1>
      {/* Content here */}
    </article>
  );
}
```

## Nested Routes

You can nest routes as deeply as needed:

```
src/app/dashboard/settings/account/page.tsx  # /dashboard/settings/account
```

## Navigation

Use the Next.js `Link` component for client-side navigation:

```tsx
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}
```

## Route Groups

You can organize routes without affecting the URL structure using route groups:

```
src/app/(marketing)/about/page.tsx  # /about (not /marketing/about)
```

## Parallel Routes

For displaying multiple pages in the same layout simultaneously:

```
src/app/@dashboard/page.tsx     # Loaded at /
src/app/@settings/page.tsx      # Also loaded at /
src/app/layout.tsx              # Contains both slots
```

## Intercepting Routes

For modal patterns and advanced UI flows:

```
src/app/posts/(.)[id]/page.tsx  # Intercepts /posts/123
```

Understanding Next.js routing is crucial for building effective applications with optimized navigation and user experience.
