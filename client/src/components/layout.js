import React from 'react';
import { css } from '@emotion/core';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';
import { rhythm } from '../utils/typography';

export default ({ children }) => (
  <Router>
    <div
      css={css`
        margin: 0 auto;
        max-width: 700px;
        padding: ${rhythm(2)};
        @media (max-width: 550px) {
          padding: ${rhythm(1)};
        }
        padding-top: ${rhythm(1.5)};

        color: var(--textNormal);
        transition-duration: 0.2s;
        transition-property: background-color, color;
    `}
    >

      <Link to="/">
        <h3
          css={css`
          margin-bottom: ${rhythm(2)};
          display: inline-block;
          font-style: normal;
        `}
        >
          The Imagination
        </h3>
      </Link>

      {children}
    </div>
  </Router>
);
