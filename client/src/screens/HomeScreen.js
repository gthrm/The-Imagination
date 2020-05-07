import React from 'react';
import { css } from '@emotion/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import { createGame, startGame, gameSelector } from '../redux/ducks/game';
import Button from '../components/button';
import Players from '../components/Players';
import Cards from '../components/Cards';

export default function HomeScreen() {
  const history = useHistory();
  const game = useSelector(gameSelector);
  const players = game?.players;
  const [createGameApi, startGameApi] = useActions([createGame, startGame]);
  const createGameHandler = () => createGameApi();
  const startGameHandler = () => startGameApi();
  const gameIsCreated = game;
  const gameIsStarted = game?.started;
  const drawPile = game?.drawPile;
  const riddle = game?.riddle;
  const votingIsStart = game?.voting;
  const joinTheGame = () => history.push('/joingame');

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

        {!gameIsStarted && (
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
        )}
        {drawPile?.length > 0 && (
          <div
            css={css`
              flex-direction: column;
              display: flex;
            `}
          >
            <Cards cards={drawPile} votingIsStart={!!votingIsStart} />
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
