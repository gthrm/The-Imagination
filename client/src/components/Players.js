import React from 'react';
import { css } from '@emotion/core';
import Player from './Player';

export default function Players(props) {
  const {
    players
  } = props;
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    `}
    >
      {!!Array.isArray(players) && players.map((player) => <Player key={player.name} player={player} />)}
    </div>
  );
}
