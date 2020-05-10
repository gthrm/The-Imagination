import React from 'react';
import { css } from '@emotion/core';
import Button from './button';
import Card from './Card';

export default function Voting(props) {
  const {
    hasVoting,
    cardForVoting,
    voteForCardApi,
    selectNumberApi
  } = props;
  return (
    <div>
      <p
        css={css`
            color: var(--textTitle);
          `}
      >
        Какую карту загадал игрок?
      </p>
      <div
        css={css`
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex: 1;
          flex-wrap: wrap;
      `}
      >

        {!!Array.isArray(cardForVoting) && cardForVoting.map(
          (card) => (
            <Card
              key={card.id}
              card={card}
              selectCardApi={() => selectNumberApi({ card })}
              selected={card.selected}
            />
          )
        )}
      </div>
      {!!hasVoting && <Button title="Готово" onClick={voteForCardApi} />}
    </div>
  );
}
