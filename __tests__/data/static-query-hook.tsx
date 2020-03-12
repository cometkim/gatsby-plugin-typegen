// @ts-nocheck
/* eslint-disable */

import React from "react";
import { StaticQuery, useStaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";

const Image = () => {
  const data1 = useStaticQuery<GatsbyTypes.Image1Query>(graphql`
    query Image1 {
      placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  const data2 = useStaticQuery<GatsbyTypes.Image2Query>(graphql`
    query Image2 {
      placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  const data3 = useStaticQuery<GatsbyTypes.Image3Query>(graphql`
    query Image3 {
      placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return (
    <Img fluid={data1.placeholderImage.childImageSharp.fluid} />
  );
};

export default Image;
