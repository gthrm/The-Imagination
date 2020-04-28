import React from 'react';
import { css } from '@emotion/core';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import { createGame, startGame, gameSelector } from '../redux/ducks/game';

export default function HomeScreen() {
  const title = 'HomeScreen';
  const game = useSelector(gameSelector);
  const [createGameApi, startGameApi] = useActions([createGame, startGame]);
  const createGameHandler = () => createGameApi();
  const startGameHandler = () => startGameApi();
  const gameIsCreated = game;
  // const gameIsStarted = game && game.started;

  return (
    <Layout>
      <div
        css={css`
          font-size: 40px;
      `}
      >
        {title}
      </div>
      <button
        type="button"
        onClick={gameIsCreated ? startGameHandler : createGameHandler}
      >
        {gameIsCreated ? 'Начать игру' : 'Новая игра'}
      </button>
      <div>
        {!!game?.gameId && `Игра: ${game?.gameId}`}
      </div>
      <div>
        {!!game?.error && `Ошибка: ${game?.error}`}
      </div>
    </Layout>
  );
}
