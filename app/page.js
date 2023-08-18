import Link from "next/link";

import { Layout, Bio, SEO } from "@components/common";
import { generateRssPostsFeed } from "@utils/rss";

export default function Home({ posts }) {
  return (
    <Layout>
      <SEO title="All posts" />
      <Bio className="my-14" />
      {posts.map(({ title, description, date, slug }) => (
        <article key={slug}>
          <header className="mb-2">
            <h3 className="mb-2">
              <Link href={`/posts/${slug}`}>
                <a className="text-4xl font-bold text-yellow-600 font-display">
                  {title}
                </a>
              </Link>
            </h3>
            <span className="text-sm">{date}</span>
          </header>
          <section>
            <p className="mb-8 text-lg">{description}</p>
          </section>
        </article>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  await generateRssPostsFeed();
  const res = await fetch("https://api.example.com/posts", { cache: 'force-cache' });
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    revalidate: 60, // revalidate every 60 seconds
  };
}