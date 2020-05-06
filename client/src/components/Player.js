import React from 'react';
import { css } from '@emotion/core';
import getPath from '../utils/pathUtils';

export default function Player(props) {
  const {
    player
  } = props;

  console.log('player', player);

  return (
    <div
      css={css`
      width: ${player?.myTurn ? '90px' : '70px'};
      height: ${player?.myTurn ? '120px' : '100px'};;
      border: ${player?.myTurn ? 'solid #98026099 3px' : 'solid var(--textLink) 0px'};
      background-color: #ffffff33;
      border-radius: 15px;
      padding: 5px;
      margin: 5px;
      text-align: center;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition-duration: 0.2s;
      transition-property: all;
    `}
    >
      <img
        src={getPath(player.image[0].path)}
        alt="card"
      />
      <p
        css={css`
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        `}
      >
        {`${player.name}`.toUpperCase()}
      </p>
    </div>
  );
}
