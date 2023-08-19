import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";
import Image from "next/image";

import { Layout, SEO, Bio } from "@components/common";
import { getPostsSlugs } from "@utils/posts";

export default function Post({ post, frontmatter, nextPost, previousPost }) {
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || post.excerpt}
      />

      <article>
        <header className="mb-8">
          <h1 className="mb-2 text-6xl font-black leading-none font-display">
            {frontmatter.title}
          </h1>
          <p className="text-sm">{frontmatter.date}</p>
        </header>
        <ReactMarkdown
          className="mb-4 prose lg:prose-lg dark:prose-dark"
          escapeHtml={false}
          source={post.content}
          renderers={{ code: CodeBlock, image: MarkdownImage }}
        />
        <hr className="mt-4" />
        <footer>
          <Bio className="mt-8 mb-16" />
        </footer>
      </article>

      <nav className="flex flex-wrap justify-between mb-10">
        {previousPost ? (
          <Link href={`/posts/${previousPost.slug}`}>
            <a className="text-lg font-bold">
              ← {previousPost.frontmatter.title}
            </a>
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link href={`/posts/${nextPost.slug}`}>
            <a className="text-lg font-bold">{nextPost.frontmatter.title} →</a>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getPostsSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postData = await fetchPostBySlug(slug);

  return { props: postData };
}

async function fetchPostBySlug(slug) {
  // Check if the post is already cached
  const cacheKey = `post-${slug}`;
  const cachedPost = cache.get(cacheKey);
  if (cachedPost) {
    return cachedPost;
  }

  // Fetch the post data from the API
  const response = await fetch(`/api/posts/${slug}`);
  const postData = await response.json();

  // Cache the post data
  cache.set(cacheKey, postData);

  return postData;
}

const cache = new Map();

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter style={style} language={language}>
      {value}
    </SyntaxHighlighter>
  );
};

const MarkdownImage = ({ alt, src }) => {
  return (
    <Image
      alt={alt}
      src={require(`../../content/assets/${src}`)}
      placeholder="blur"
      className="w-full"
    />
  );
};
