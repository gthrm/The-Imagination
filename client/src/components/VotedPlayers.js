import React from 'react';
import { css } from '@emotion/core';

export default function VotedPlayers(props) {
  const {
    votedPlayers
  } = props;
  return (
    <div
      css={css`
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
      `}
    >
      {Array.isArray(votedPlayers) && votedPlayers.map(
        (player) => <p key={player}>{`${player}`.toUpperCase()}</p>
      )}
    </div>
  );
}
