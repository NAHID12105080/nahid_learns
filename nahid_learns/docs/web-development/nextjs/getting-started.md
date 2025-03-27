---
sidebar_position: 2
---

# Getting Started with Next.js

This guide will help you set up a Next.js project from scratch and understand the basic concepts.

## Installation

To create a new Next.js application, run:

```bash
npx create-next-app@latest my-next-app
```

Follow the prompts to configure your project. You can select options like TypeScript, ESLint, and Tailwind CSS.

## Project Structure

A basic Next.js project includes the following structure:

```
my-next-app/
├── node_modules/
├── public/         # Static files
├── src/
│   ├── app/        # App Router
│   │   └── page.tsx
│   ├── pages/      # Pages Router (optional)
│   └── styles/     # CSS styles
├── .eslintrc.json
├── next.config.js
├── package.json
└── tsconfig.json
```

## Running Your App

To start your development server:

```bash
npm run dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000).

## Adding Pages

With the App Router (Next.js 13+), you can create pages by adding files to the `src/app` directory:

```tsx
// src/app/about/page.tsx
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our Next.js application.</p>
    </div>
  );
}
```

This will be accessible at `/about`.

## Next Steps

After setting up your basic app, you can explore:

- Creating layouts and nested routes
- Implementing server and client components
- Setting up data fetching
- Adding styling with CSS or Tailwind
