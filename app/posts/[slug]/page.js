import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/prism/dracula";
import Image from "next/image";

import { Layout, SEO, Bio } from "@components/common";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";

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
          <Link
            href={`/posts/${previousPost.slug}`}
            className="text-lg font-bold"
          >
            ←{previousPost.frontmatter.title}
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
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

export async function generateStaticParams() {
  const paths = getPostsSlugs();
  const dynamicParams = false;

  return {
    paths,
    dynamicParams,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postData = getPostBySlug(slug);

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }

  return { props: postData };
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

export async function getServerData() {
  const res = await fetch('https://api.example.com/data', { cache: 'no-store' });
  const data = await res.json();

  return {
    data
  };
}

export async function getStaticData() {
  const res = await fetch('https://api.example.com/static-data', { cache: 'force-cache' });
  const data = await res.json();

  return {
    data
  };
}

export async function getRevalidatedData() {
  const res = await fetch('https://api.example.com/revalidated-data', { cache: 'no-store' });
  const data = await res.json();

  return {
    data,
    revalidate: 10
  };
}
