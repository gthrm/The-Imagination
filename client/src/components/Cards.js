/* eslint-disable react/no-array-index-key */
import React from 'react';
import { css } from '@emotion/core';
import Card from './Card';

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
          <Card
            index={index + 1}
            votingStarted={votingStarted}
            nextRoundIsAvailable={nextRoundIsAvailable}
            selectCardApi={selectCardApi}
            card={card}
            showTrue={nextRoundIsAvailable}
          />
        )
      )}
    </div>
  );
}
