import React from 'react';
import { css } from '@emotion/core';

export default function Preloader() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--bg)
      `}
    >
      <div className="preloader"><div /></div>
    </div>
  );
}
