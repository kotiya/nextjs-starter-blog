import { Metadata } from "@components/Metadata";

import { getSiteMetaData } from "@utils/helpers";

export function SEO({ title, description = "" }) {
  const siteMetadata = getSiteMetaData();

  const metaDescription = description || siteMetadata.description;

  return (
    <Metadata
      title={`${title} | ${siteMetadata.title}`}
      description={metaDescription}
      ogType="website"
      ogTitle={title}
      ogDescription={metaDescription}
      twitterCard="summary"
      twitterTitle={title}
      twitterDescription={metaDescription}
      twitterCreator={siteMetadata.social.twitter}
      favicon="/static/favicon.ico"
      appleTouchIcon="/static/favicon.ico"
    />
  );
}