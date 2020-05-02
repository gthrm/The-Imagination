import React from 'react';
import { css } from '@emotion/core';

export default ({ children }) => (
  <div
    css={css`
        margin: 0 auto;
        max-width: 700px;
        min-width: 300px;
        flex: 1;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
    {children}
  </div>
);
