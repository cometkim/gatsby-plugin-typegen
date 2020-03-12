// @ts-nocheck
/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';

import Layout from '../components/Layout';
import PhotoGrid from '../components/PhotoGrid';
import BlogItem from '../components/BlogItem';

export const IndexPageTemplate = ({
  image,
  title,
  subtitle,
  heading,
  mainpitch,
  bigimage,
  description,
  intro,
  post
}) => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetadata {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  );
  console.log(site);

  return (
    <div>
      <div
        className="full-width-image margin-top-0"
        style={{
          backgroundImage: `url(${
            !!image.childImageSharp ? image.childImageSharp.fluid.src : image
          })`,
          backgroundPosition: `top left`,
          backgroundAttachment: `fixed`
        }}>
        <div
          style={{
            display: 'flex',
            height: '150px',
            lineHeight: '1',
            justifyContent: 'space-around',
            alignItems: 'left',
            flexDirection: 'column'
          }}>
          <h1
            className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0.75) 0.5rem 0px 0px, rgba(0, 0, 0, 0.75) -0.5rem 0px 0px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              lineHeight: '1',
              padding: '0.25em'
            }}>
            {title}
          </h1>
          <h3
            className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0.75) 0.5rem 0px 0px, rgba(0, 0, 0, 0.75) -0.5rem 0px 0px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              lineHeight: '1',
              padding: '0.25em'
            }}>
            {subtitle}
          </h3>
        </div>
      </div>

      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="content">
                  <div className="content">
                    <div className="tile">
                      <h3 className="subtitle">{mainpitch.description}</h3>
                    </div>
                  </div>

                  <section className="section">
                    <div className="container has-text-centered">
                      <div className="block">
                        <img src={bigimage.image.publicURL} alt={bigimage.alt} />
                      </div>

                      <PhotoGrid gridItems={intro.blurbs} />

                      <h4 className="title is-spaced is-4">{intro.heading}</h4>
                      <p className="subtitle">{intro.description}</p>
                    </div>
                  </section>

                  <div className="columns">
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" to="/products">
                        See all products
                      </Link>
                    </div>
                  </div>
                  <div className="column is-12">
                    <BlogItem post={post} columnWidth="is-12" />
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" to="/blog">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  heading: PropTypes.string,
  mainpitch: PropTypes.object,
  bigimage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array
  }),
  post: PropTypes.object
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        heading={frontmatter.heading}
        mainpitch={frontmatter.mainpitch}
        bigimage={frontmatter.bigimage}
        description={frontmatter.description}
        intro={frontmatter.intro}
        post={data.allMarkdownRemark.edges[0].node}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object
    }),
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    })
  })
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        subtitle
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        mainpitch {
          title
          description
        }
        bigimage {
          image {
            childImageSharp {
              fluid(maxWidth: 240, quality: 64) {
                ...GatsbyImageSharpFluid
              }
            }
            publicURL
          }
          alt
        }
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___featuredpost, frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      limit: 1
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            featuredpost
            featuredimage {
              childImageSharp {
                fluid(maxWidth: 120, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;
