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

  // Tutorial sidebar
  tutorialSidebar: [
    {
      type: "category",
      label: "Tutorial",
      items: [
        "intro",
        {
          type: "category",
          label: "Tutorial Basics",
          items: [
            "tutorial-basics/create-a-document",
            "tutorial-basics/create-a-blog-post",
            "tutorial-basics/create-a-page",
            "tutorial-basics/markdown-features",
            "tutorial-basics/deploy-your-site",
            "tutorial-basics/congratulations",
          ],
        },
        {
          type: "category",
          label: "Tutorial Extras",
          items: [
            "tutorial-extras/manage-docs-versions",
            "tutorial-extras/translate-your-site",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
