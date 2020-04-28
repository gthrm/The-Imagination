import React from 'react';
import { css } from '@emotion/core';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div>Footer</div>
);

export default ({ children }) => (
  <div
    css={css`
        margin: 0 auto;
        max-width: 700px;
        padding: 30px;
        @media (max-width: 550px) {
          padding: 10px;
        }
        padding-top: 25px;
        color: var(--textNormal);
        transition-duration: 0.2s;
        transition-property: background-color, color;
    `}
  >
    <Link to="/">
      <h3
        css={css`
          margin-bottom: 20px;
          margin-right: 20px;
          display: inline-block;
          font-style: normal;
        `}
      >
        Home screen
      </h3>
    </Link>
    <Link to="/auth">
      <h3
        css={css`
          margin-bottom: 20px;
          margin-right: 20px;
          display: inline-block;
          font-style: normal;
        `}
      >
        Auth screen
      </h3>
    </Link>
    <Link to="/other">
      <h3
        css={css`
          margin-bottom: 20px;
          margin-right: 20px;
          display: inline-block;
          font-style: normal;
        `}
      >
        Other screen
      </h3>
    </Link>
    {children}
    <Footer />
  </div>
);
