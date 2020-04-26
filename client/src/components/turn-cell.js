import React from 'react';
import { css } from '@emotion/core';

export default function TurnCell({ cell, createNewPlayer }) {
  return (
    <div
      onKeyPress={() => createNewPlayer(cell.number, 'test')} // for example
      role="button"
      tabIndex="0"
      onClick={() => createNewPlayer(cell.number, 'test')} // for example
      css={
        css`
          width: 100px;
          height: 100px;
          margin 20px;
          justify-content: center;
          align-items: center;
          display: flex;
          border: solid black;
          background:#fff;
          border-width: 3px 3px 5px 5px;
          border-radius:4% 95% 6% 95%/95% 4% 92% 5%;
          transform: rotate(-2deg);
      `
      }
    >
      {cell.number}
      {cell.players}
    </div>
  );
}
