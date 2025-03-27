import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Nahid Learns",
  tagline: "My Learning Journey in Tech",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://nahid-learns.vercel.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "nahid", // Usually your GitHub org/user name.
  projectName: "nahid-learns", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/nahid/nahid-learns/tree/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/nahid/nahid-learns/tree/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/nahid-learns-social-card.jpg",
    navbar: {
      title: "NahidLearns",
      logo: {
        alt: "Nahid Learns Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "problemSolvingSidebar",
          position: "left",
          label: "Problem Solving",
        },
        {
          type: "docSidebar",
          sidebarId: "webDevSidebar",
          position: "left",
          label: "Web Development",
        },
        {
          type: "docSidebar",
          sidebarId: "aiSidebar",
          position: "left",
          label: "AI & ML",
        },
        {
          type: "docSidebar",
          sidebarId: "appDevSidebar",
          position: "left",
          label: "App Development",
        },

        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/nahid/nahid-learns",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            {
              label: "Problem Solving",
              to: "/docs/problem-solving/intro",
            },
            {
              label: "Web Development",
              to: "/docs/web-development/intro",
            },
            {
              label: "AI & Machine Learning",
              to: "/docs/ai/intro",
            },
            {
              label: "App Development",
              to: "/docs/app-development/intro",
            },
          ],
        },
        {
          title: "Connect",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/nahid",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/nahid",
            },
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/nahid",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "Source Code",
              href: "https://github.com/nahid/nahid-learns",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nahid Learns.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    // Enable dark mode
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
