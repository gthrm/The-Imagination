import React from 'react';
import { css } from '@emotion/core';

export default function ButtonLayout({ children }) {
  return (
    <div
      css={css`
      flex-direction: column;
      display: flex;
      background-color: #463973;
      border-radius: 5px;
    `}
    >
      { children }
    </div>
  );
}
