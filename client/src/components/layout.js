import React from 'react';
import {
  Link,
  useLocation
} from 'react-router-dom';
import { css } from '@emotion/core';

export default ({ children }) => {
  const location = useLocation();
  const showHomeButton = !(location.pathname === '/' || location.pathname === '/auth');
  return (
    <div
      css={css`
        margin: 0 auto;
        max-width: 700px;
        min-width: 300px;
        flex: 1;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        @media (max-width: 550px) {
          padding: 10px;
        }
        padding-top: 25px;
        color: var(--textNormal);
        transition-duration: 0.2s;
        transition-property: background-color, color;
    `}
    >
      <div
        css={css`
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          margin: 10px 0;
        `}
      >
        {showHomeButton && (
        <Link
          css={css`
            padding: 5px;
            border-radius: 5px;
            background-color: var(--hr);
            `}
          to="/"
        >
          <span aria-label="Snowman" role="img">💻 На главную</span>
        </Link>
        )}
      </div>
      {children}
    </div>
  );
};
