import React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type SEOMeta = (
  | {
    name: string,
    content: string,
  }
  | {
    property: string,
    content: string,
  }
);

interface SEOProps {
  title?: string;
  description?: string;
  lang?: string;
  meta?: SEOMeta[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  lang,
  meta = [],
}) => {
  const { site } = useStaticQuery<GatsbyTypes.SEOQuery>(
    graphql`
      query SEO {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaTitle = title || site.siteMetadata.title;
  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: metaTitle,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: site.siteMetadata.author,
        },
        {
          name: 'twitter:title',
          content: metaTitle,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
      ].concat(meta)}
    />
  );
};

export default SEO;
