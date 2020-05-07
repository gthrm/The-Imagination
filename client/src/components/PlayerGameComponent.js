/* eslint-disable no-nested-ternary */
import React from 'react';
import { css } from '@emotion/core';
import Cards from './Cards';
import Riddle from './Riddle';
import Button from './button';

export default function PlayerGameComponent(props) {
  const {
    player,
    turn,
    me,
    selectCardApi,
    throwCardApi
  } = props;
  return (
    <div
      css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            padding-bottom: 50px;
            flex: 1;
        `}
    >
      {!!player && !!me
        && (
          <>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
            `}
            >
              <div
                css={css`
                display: flex;
                flex-direction: column;
                flex: 1;
            `}
              >
                <h4>{`👩‍💻👨‍💻 - ${me.playerName.toUpperCase()}`}</h4>
                <h4>{`🎮 - ${me.gameId.toUpperCase()}`}</h4>
              </div>
              <div
                css={css`
                  font-size: 20px;
                  display: flex;
                  justify-content: flex-end;
                  flex: 1;
              `}
              >
                {player.myTurn ? 'Ваш ход' : (turn?.data ? `Ходит ${turn?.data}` : '')}
              </div>
            </div>
            <Cards cards={player?.cards} selectCardApi={selectCardApi} />
            {!!player.myTurn && <Riddle />}
            {!!player.hasThrowCard && <Button title="Держи карту" onClick={throwCardApi} />}
          </>
        )}

      {!player && me
        && (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              flex: 1;
          `}
          >
            <h4>
              <span
                role="img"
                aria-label="Snowman"
              >
                👩‍💻👨‍💻
              </span>
              {' '}
              ожидание других игроков
            </h4>
            <h4>{`🎮 - ${me.gameId.toUpperCase()}`}</h4>
          </div>
        )}
    </div>
  );
}
