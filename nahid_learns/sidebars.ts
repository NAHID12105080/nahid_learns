import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Problem Solving Sidebar
  problemSolvingSidebar: [
    {
      type: "category",
      label: "Problem Solving",
      link: {
        type: "doc",
        id: "problem-solving/intro",
      },
      items: [
        {
          type: "category",
          label: "Competitive Programming Concepts",
          link: {
            type: "doc",
            id: "problem-solving/cp-concepts/intro",
          },
          items: [
            "problem-solving/cp-concepts/time-complexity",
            "problem-solving/cp-concepts/data-structures",
            "problem-solving/cp-concepts/algorithms",
            "problem-solving/cp-concepts/dynamic-programming",
          ],
        },
      ],
    },
  ],

  // AI & Machine Learning Sidebar
  aiSidebar: [
    {
      type: "category",
      label: "AI & Machine Learning",
      link: {
        type: "doc",
        id: "ai/intro",
      },
      items: [],
    },
  ],

  // App Development Sidebar
  appDevSidebar: [
    {
      type: "category",
      label: "App Development",
      link: {
        type: "doc",
        id: "app-development/intro",
      },
      items: [],
    },
  ],

  // Web Development Sidebar
  webDevSidebar: [
    {
      type: "category",
      label: "Web Development",
      link: {
        type: "doc",
        id: "web-development/intro",
      },
      items: [
        {
          type: "category",
          label: "Next.js",
          link: {
            type: "doc",
            id: "web-development/nextjs/intro",
          },
          items: [
            "web-development/nextjs/getting-started",
            "web-development/nextjs/routing",
            "web-development/nextjs/data-fetching",
          ],
        },
        {
          type: "category",
          label: "React.js",
          link: {
            type: "doc",
            id: "web-development/reactjs/intro",
          },
          items: [
            "web-development/reactjs/hooks",
            "web-development/reactjs/state-management",
            "web-development/reactjs/performance",
            "web-development/reactjs/testing",
            "web-development/reactjs/security",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
