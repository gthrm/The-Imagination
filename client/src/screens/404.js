import React from 'react';
import { css } from '@emotion/core';
import Layout from '../components/layout';

export default function NotFound() {
  const title = '404 NotFound';
  return (
    <Layout>
      <div
        css={css`
          font-size: 40px;
          color: #eb4b43;
      `}
      >
        {title}
      </div>
    </Layout>
  );
}
