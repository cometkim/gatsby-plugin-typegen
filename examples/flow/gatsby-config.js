module.exports = {
  siteMetadata: {
    title: 'gatsby-plugin-typegen example',
    description: 'gatsby-plugin-typegen example with Flow',
  },
  plugins: [
    'gatsby-plugin-react-helmet-async',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: 'src/images',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        language: 'flow',
        outputPath: 'src/__generated__/gatsby-types.js',
        emitSchema: {
          'src/__generated__/gatsby-introspection.json': true,
          'src/__generated__/gatsby-schema.graphql': true,
        },
        emitPluginDocument: {
          'src/__generated__/gatsby-plugin-documents.graphql': true,
        },
      },
    },
  ],
};
