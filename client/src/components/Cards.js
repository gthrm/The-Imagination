/* eslint-disable react/no-array-index-key */
import React from 'react';
import { css } from '@emotion/core';
import Card from './Card';
import NumberOfCard from './NumberOfCard';
import VotedPlayers from './VotedPlayers';

export default function Cards(props) {
  const {
    cards = [],
    votingStarted,
    nextRoundIsAvailable,
    selectCardApi = () => { }
  } = props;
  return (
    <div
      css={css`
            display: flex;
            justify-content: space-around;
            flex-direction: row;
            position: relative;
            flex-wrap: wrap;
          `}
    >
      {cards.map(
        (card, index) => (
          <div
            key={card.fileName}
            css={css`
              position: relative;
              padding: 0 10px;
            `}
          >
            <Card
              selectCardApi={selectCardApi}
              card={card}
              showTrue={nextRoundIsAvailable}
            />
            {!!votingStarted && <NumberOfCard index={index + 1} />}
            {nextRoundIsAvailable && <VotedPlayers votedPlayers={card.votedPlayers} />}
          </div>
        )
      )}
    </div>
  );
}
