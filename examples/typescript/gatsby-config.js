const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'gatsby-plugin-typegen example',
    author: 'Hyeseong Kim',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        language: 'typescript',
        emitSchema: {
          'src/__generated__/gatsby-introspection.json': true,
          'src/__generated__/gatsby-schema.graphql': true,
        },
        emitPluginDocuments: {
          'src/__generated__/gatsby-plugin-documents.graphql': true,
          'src/__generated__/gatsby-plugin-documents.gql': true,
          'src/__generated__/gatsby-plugin-documents.json': true,
        },
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: path.resolve(__dirname, 'src/pages'),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-image',
  ],
};
