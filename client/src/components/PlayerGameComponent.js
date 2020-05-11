/* eslint-disable no-nested-ternary */
import React from 'react';
import { css } from '@emotion/core';
import Cards from './Cards';
import Riddle from './Riddle';
import Button from './button';
import ButtonLayout from './ButtonLayout';

export default function PlayerGameComponent(props) {
  const {
    player,
    turn,
    joinData,
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
      {!!player && !!joinData
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
                <h4>{`👩‍💻👨‍💻 - ${joinData.playerName.toUpperCase()}`}</h4>
                <h4>{`🎮 - ${joinData.gameId.toUpperCase()}`}</h4>
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
            {!!player.hasThrowCard && <ButtonLayout><Button title="Держи карту" onClick={throwCardApi} /></ButtonLayout>}
          </>
        )}

      {!player && joinData
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
            <h4>{`🎮 - ${joinData.gameId.toUpperCase()}`}</h4>
          </div>
        )}
    </div>
  );
}
