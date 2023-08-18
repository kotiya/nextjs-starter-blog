import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout, Bio, SEO } from "@components/common";
import { generateRssPostsFeed } from "@utils/rss";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    generateRssPostsFeed();

    const fetchData = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <SEO title="All posts" />
      <Bio className="my-14" />
      {posts.map(({ title, description, date, slug }) => (
        <article key={slug}>
          <header className="mb-2">
            <h3 className="mb-2">
              <Link
                href={"/posts/[slug]"}
                as={`/posts/${slug}`}
                className="text-4xl font-bold text-yellow-600 font-display"
              >
                {title}
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
