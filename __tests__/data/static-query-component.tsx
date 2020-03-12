// @ts-nocheck
/* eslint-disable */

import React from "react"
import { StaticQuery, graphql } from "gatsby"

export default () => (
  <StaticQuery<GatsbyTypes.HeadingQuery>
    query={graphql`
      query Heading {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <header>
        <h1>{data.site.siteMetadata.title}</h1>
      </header>
    )}
  />
);
