import { generateStaticParams } from "@utils/posts";

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

export async function getStaticPaths() {
  const paths = generateStaticParams();

  return {
    paths,
    fallback: false,
  };
}

export async function getServerSideProps({ params: { slug } }) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    method: "GET",
    cache: "no-store",
  });
  const postData = await res.json();

  return {
    props: {
      post: postData.post,
      frontmatter: postData.frontmatter,
      nextPost: postData.nextPost,
      previousPost: postData.previousPost,
    },
  };
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    method: "GET",
    cache: "force-cache",
  });
  const postData = await res.json();

  return {
    props: {
      post: postData.post,
      frontmatter: postData.frontmatter,
      nextPost: postData.nextPost,
      previousPost: postData.previousPost,
    },
    revalidate: 10,
  };
}