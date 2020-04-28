import React from 'react';
import { css } from '@emotion/core';
import Layout from '../components/layout';

export default function HomeScreen() {
  const title = 'HomeScreen';
  return (
    <Layout>
      <div
        css={css`
          font-size: 40px;
      `}
      >
        {title}
      </div>
    </Layout>
  );
}
