import { NextSeo } from 'next-seo';

export default function SEO({ title, description = "" }) {
  const siteMetadata = getSiteMetaData();

  const metaDescription = description || siteMetadata.description;

  return (
    <NextSeo
      title={`${title} | ${siteMetadata.title}`}
      description={metaDescription}
      openGraph={{
        type: 'website',
        title,
        description: metaDescription,
        url: siteMetadata.url,
        images: [
          {
            url: siteMetadata.image,
            alt: siteMetadata.title,
          },
        ],
      }}
      twitter={{
        cardType: 'summary',
        site: siteMetadata.social.twitter,
        handle: siteMetadata.social.twitter,
      }}
      favicon="/static/favicon.ico"
      appleTouchIcon="/static/favicon.ico"
    />
  );
}