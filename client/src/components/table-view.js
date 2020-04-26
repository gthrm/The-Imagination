import React from 'react';
import { css } from '@emotion/core';
import TurnCell from './turn-cell';

export default function ShopView({ gameData, createNewPlayer }) {
  const { turnCells } = gameData;
  return (
    <div
      css={css`
            display: flex;
            flex-wrap: wrap;
            border: solid black;
            background:#fff;
            border-width: 3px 4px 3px 5px;
            border-radius:95% 4% 92% 5%/4% 95% 6% 95%;
            transform: rotate(2deg);
          `}
    >
      {Array.isArray(turnCells) && turnCells.map((cell) => <TurnCell key={cell.id} cell={cell} createNewPlayer={createNewPlayer} />)}
    </div>
  );
}
