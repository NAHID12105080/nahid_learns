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
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/problem-solving/intro"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

interface FeatureItem {
  title: string;
  description: JSX.Element;
  link: string;
}

const FeatureList: FeatureItem[] = [
  {
    title: "Problem Solving",
    description: (
      <>
        Dive into competitive programming concepts, algorithms, data structures,
        and problem-solving techniques.
      </>
    ),
    link: "/docs/problem-solving/intro",
  },
  {
    title: "Web Development",
    description: (
      <>
        Learn modern web development with Next.js, React.js, and explore
        practical projects and case studies.
      </>
    ),
    link: "/docs/web-development/intro",
  },
  {
    title: "AI & Machine Learning",
    description: (
      <>
        Explore artificial intelligence, machine learning fundamentals, and
        practical applications of large language models.
      </>
    ),
    link: "/docs/ai/intro",
  },
  {
    title: "App Development",
    description: (
      <>
        Build cross-platform mobile applications using React Native, Flutter,
        and other modern frameworks.
      </>
    ),
    link: "/docs/app-development/intro",
  },
];

function Feature({ title, description, link }: FeatureItem) {
  return (
    <div className="col col--6 margin-vert--md">
      <div className="card padding--lg shadow--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <div className={styles.buttons}>
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
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section className={styles.recentUpdates}>
          <div className="container">
            <div className="row">
              <div className="col">
                <Heading as="h2" className="text--center margin-vert--lg">
                  Recent Updates
                </Heading>
                <div className="card padding--lg shadow--md">
                  <p className="text--center">
                    Check out the latest updates in the{" "}
                    <Link to="/blog">blog section</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
