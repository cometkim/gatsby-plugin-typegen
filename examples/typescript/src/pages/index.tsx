import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

import Layout from '../components/layout';
import Seo from '../components/seo';

const IndexPage: React.FC = () => (
  <Layout>
    <Seo title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <StaticImage
      src="../images/gatsby-astronaut.png"
      width={300}
      quality={95}
      formats={['auto', 'webp', 'avif']}
      alt="A Gatsby astronaut"
      style={{ marginBottom: '1.45rem' }}
    />
    <ul>
      <li>
        <Link to="/page-2/">Go to page 2</Link>
      </li>
      <li>
        <Link to="/using-typescript/">
          {'Go to "Using TypeScript"'}
        </Link>
      </li>
    </ul>
  </Layout>
);

export default IndexPage;
