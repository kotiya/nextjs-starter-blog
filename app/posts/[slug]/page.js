import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";
import Image from "next/image";
import { useRouter } from "next/router";

import { Layout, SEO, Bio } from "@components/common";
import { fetchPostBySlug, fetchPostsSlugs } from "@utils/posts";

export default function Post({ post, frontmatter, nextPost, previousPost }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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
          <Link
            href={`/posts/[slug]`}
            as={`/posts/${previousPost.slug}`}
            className="text-lg font-bold"
          >
            ←{previousPost.frontmatter.title}
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link
            href={`/posts/[slug]`}
            as={`/posts/${nextPost.slug}`}
            className="text-lg font-bold"
          >
            {nextPost.frontmatter.title}→
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </Layout>
  );
}

export async function fetchPostBySlug(slug) {
  const res = await fetch(`/api/posts/${slug}`);
  const postData = await res.json();
  return postData;
}

export async function fetchPostsSlugs() {
  const res = await fetch(`/api/posts`);
  const slugs = await res.json();
  return slugs;
}

export async function fetchPreviousPost(slug) {
  const res = await fetch(`/api/posts/${slug}/previous`);
  const previousPost = await res.json();
  return previousPost;
}

export async function fetchNextPost(slug) {
  const res = await fetch(`/api/posts/${slug}/next`);
  const nextPost = await res.json();
  return nextPost;
}

export async function fetchPostData(slug) {
  const post = await fetchPostBySlug(slug);
  const frontmatter = post.frontmatter;
  const previousPost = await fetchPreviousPost(slug);
  const nextPost = await fetchNextPost(slug);

  return {
    post,
    frontmatter,
    previousPost,
    nextPost,
  };
}

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
      style={{
        maxWidth: "100%",
        height: "auto"
      }}
    />
  );
};
