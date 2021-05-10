import * as React from 'react';
import type { PageProps } from 'gatsby';
import { graphql } from 'gatsby';

type IndexPageProps = PageProps<GatsbyTypes.IndexPageQuery, GatsbyTypes.SitePageContext>;

const IndexPage: React.FC<IndexPageProps> = ({
  data,
}) => {
  return (
    <h1>{data.site?.siteMetadata?.title ?? 'no title'}</h1>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
