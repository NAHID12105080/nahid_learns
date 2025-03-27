import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg margin-right--md"
                to="/docs/problem-solving/intro"
              >
                Start Learning
              </Link>
              {/* <Link
                className="button button--outline button--lg button--secondary"
                to="/docs/intro"
              >
                Documentation
              </Link> */}
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.heroImage}>
              <img
                src="/img/learning-illustration.svg"
                alt="Learning journey illustration"
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

interface FeatureItem {
  title: string;
  description: ReactNode;
  link: string;
  icon: string;
}

const FeatureList: FeatureItem[] = [
  {
    title: "Problem Solving",
    description: (
      <>
        Master algorithms, data structures, and competitive programming
        techniques to solve complex problems efficiently.
      </>
    ),
    link: "/docs/problem-solving/intro",
    icon: "🧩",
  },
  {
    title: "Web Development",
    description: (
      <>
        Build modern web applications with React, Next.js, and other
        cutting-edge technologies through practical, hands-on projects.
      </>
    ),
    link: "/docs/web-development/intro",
    icon: "🌐",
  },
  {
    title: "AI & Machine Learning",
    description: (
      <>
        Explore the world of artificial intelligence, from basic ML algorithms
        to advanced neural networks and practical LLM applications.
      </>
    ),
    link: "/docs/ai/intro",
    icon: "🤖",
  },
  {
    title: "App Development",
    description: (
      <>
        Create cross-platform mobile applications with React Native and Flutter,
        from development environment setup to app store deployment.
      </>
    ),
    link: "/docs/app-development/intro",
    icon: "📱",
  },
];

function Feature({ title, description, link, icon }: FeatureItem) {
  return (
    <div className="col col--6 margin-vert--lg">
      <div className={clsx("card", styles.featureCard)}>
        <div className="card__header">
          <div className={styles.featureIcon}>{icon}</div>
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">{description}</div>
        <div className="card__footer">
          <Link className="button button--primary button--sm" to={link}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A learning journey in tech, problem-solving, AI, web and app development"
    >
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">
              What You'll Learn
            </Heading>
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
