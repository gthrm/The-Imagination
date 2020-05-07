/* eslint-disable react/no-array-index-key */
import React from 'react';
import { css } from '@emotion/core';
import Card from './Card';

export default function Cards(props) {
  const {
    cards = [],
    votingIsStart,
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
            css={css`
              position: relative;
            `}
          >
            <Card
              selectCardApi={selectCardApi}
              key={card.fileName}
              card={card}
            />
            {votingIsStart
              && (
                <p
                  key={index + 1}
                  css={css`
                    font-size: 16px;
                    text-align: center;
                    position: absolute;
                    right: -8px;
                    top: -8px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.59);
                    line-height: 30px;
                    border: 1px solid;
                    color: #bbadd9;
                  `}
                >
                  {index + 1}
                </p>
              )}
          </div>
        )
      )}
    </div>
  );
}
