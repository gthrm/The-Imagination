import React from 'react';
import { css } from '@emotion/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import { createGame, startGame, gameSelector } from '../redux/ducks/game';
import Button from '../components/button';

export default function HomeScreen() {
  const history = useHistory();
  const game = useSelector(gameSelector);
  const [createGameApi, startGameApi] = useActions([createGame, startGame]);
  const createGameHandler = () => createGameApi();
  const startGameHandler = () => startGameApi();
  const gameIsCreated = game;

  const joinTheGame = () => history.push('/joingame');

  return (
    <Layout>
      <div
        css={css`
              flex-direction: column;
              display: flex;
              background-color: #463973;
              border-radius: 5px;
            `}
      >
        <Button
          onClick={gameIsCreated ? startGameHandler : createGameHandler}
          title={gameIsCreated ? 'Начать игру' : 'Новая игра'}
        />
        {!gameIsCreated && (
          <Button
            onClick={joinTheGame}
            title="Присоедениться к игре"
          />
        )}
      </div>
      <div>
        {!!game?.gameId && <p>{`Идентификатор: ${game?.gameId}`}</p>}
      </div>
      <div>
        {!!game?.error && `Ошибка: ${game?.error}`}
      </div>
    </Layout>
  );
}
