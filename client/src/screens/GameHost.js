import React from 'react';
import { css } from '@emotion/core';
import { useSelector } from 'react-redux';
import {
  Redirect,
  useLocation
} from 'react-router-dom';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import {
  startGame,
  gameSelector,
  startNextRound
} from '../redux/ducks/game';

import Button from '../components/button';
import ButtonLayout from '../components/ButtonLayout';
import Players from '../components/Players';
import Cards from '../components/Cards';

export default function GameHost() {
  const location = useLocation();
  const game = useSelector(gameSelector);
  const players = game?.players;
  const [startGameApi, startNextRoundApi] = useActions([startGame, startNextRound]);
  const startGameHandler = () => startGameApi();
  const gameOver = game?.gameOver;
  const gameIsCreated = game;
  const gameIsStarted = game?.started;
  const drawPile = game?.drawPile;
  const riddle = game?.riddle;
  const votingStarted = game?.voting;
  const roundStarted = game?.roundStarted;
  const nextRoundIsAvailable = !votingStarted && !roundStarted;
  const winner = game?.winner;
  if (!gameIsCreated) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { from: location }
        }}
      />
    );
  }
  return (
    <Layout>
      <div
        css={css`
              flex-direction: column;
              display: flex;
              flex: 1;
              justify-content: center;
              align-items: center;
            `}
      >
        {(!gameIsStarted || gameOver) && gameIsCreated && (
          <ButtonLayout>
            <Button
              onClick={startGameHandler}
              title="Начать игру"
            />
          </ButtonLayout>
        )}
        {!gameOver && drawPile?.length > 0 && (
          <div
            css={css`
              flex-direction: column;
              display: flex;
            `}
          >
            <Cards cards={drawPile} votingStarted={!!votingStarted} nextRoundIsAvailable={nextRoundIsAvailable} />
            <p
              css={css`
                font-size: 16px;
                text-align: center;
                margin 10px;
              `}
            >
              {!!riddle && `Загадка: ${riddle}`.toUpperCase()}
            </p>
          </div>
        )}
        {!gameOver && drawPile?.length > 0 && nextRoundIsAvailable && (
          <ButtonLayout>
            <Button
              onClick={startNextRoundApi}
              title="Следующий раунд"
            />
          </ButtonLayout>
        )}
        {!!gameOver && !!winner && (
          <div>
            <p>{`Победитель - ${winner.name}`}</p>
          </div>
        )}
        <div>
          {!!game?.gameId && <p>{`🎮 - ${game?.gameId}`}</p>}
        </div>
        <div>
          {!!game?.error && `Ошибка: ${game?.error}`}
        </div>
      </div>
      <Players players={players} />
    </Layout>
  );
}
