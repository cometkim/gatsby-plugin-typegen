import path from 'path';
import { readFile } from '../src/common';
import { extractStaticQueryComponentDocuments, extractStaticQueryHookDocuments, extractPageQueryDocuments, parseFile } from '../src/parser';

describe('parser', () => {
  describe('extractStaticQueryComponentDocuments', () => {
    it('extract the document properly', async () => {
      const file = await readFile(path.resolve(__dirname, './data/static-query-component.tsx'));
      const documents = await extractStaticQueryComponentDocuments(file);
      expect(documents).toEqual([
`query Heading {
  site {
    siteMetadata {
      title
    }
  }
}
`
      ]);
    });
  });

  describe('extractStaticQueryHookDocuments', () => {
    it('extract documents properly', async () => {
      const file = await readFile(path.resolve(__dirname, './data/static-query-hook.tsx'));
      const documents = await extractStaticQueryHookDocuments(file);
      expect(documents).toEqual([
`query Image1 {
  placeholderImage: file(relativePath: {eq: "gatsby-astronaut.png"}) {
    childImageSharp {
      fluid(maxWidth: 300) {
        ...GatsbyImageSharpFluid
      }
    }
  }
}
`,
`query Image2 {
  placeholderImage: file(relativePath: {eq: "gatsby-astronaut.png"}) {
    childImageSharp {
      fluid(maxWidth: 300) {
        ...GatsbyImageSharpFluid
      }
    }
  }
}
`,
`query Image3 {
  placeholderImage: file(relativePath: {eq: "gatsby-astronaut.png"}) {
    childImageSharp {
      fluid(maxWidth: 300) {
        ...GatsbyImageSharpFluid
      }
    }
  }
}
`,
      ]);
    });
  });

  describe('extractPageQueryDocuments', () => {
    it('extract documents properly', async () => {
      const file = await readFile(path.resolve(__dirname, './data/page-query.tsx'));
      const documents = extractPageQueryDocuments(file);
      expect(documents).toHaveLength(1);
      expect(documents).toEqual([
`query HomePage1 {
  site {
    siteMetadata {
      description
    }
  }
}
`,
      ]);
    });
  });

  describe('parseFile', () => {
    it('extract all documents string from the file', async () => {
      const documents = await parseFile(path.resolve(__dirname, './data/many-documents.jsx'));
      expect(documents).toMatchSnapshot();
    });
  });
});
