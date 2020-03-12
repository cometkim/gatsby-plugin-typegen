// @ts-nocheck
/* eslint-disable */

import React from 'react'
import { graphql } from 'gatsby'

const HomePage = ({data}) => {
  return (
    <div>
      {data.site.siteMetadata.description}
    </div>
  )
}

export const pageQueryShouldBeExtracted = graphql`
  query HomePage1 {
    site {
      siteMetadata {
        description
      }
    }
  }
`

export const otherQueryShouldNotBeExtracted = graphql`
  query HomePage2 {
    site {
      siteMetadata {
        description
      }
    }
  }
`

export default HomePage
