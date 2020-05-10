import React from 'react';
import { css } from '@emotion/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import {
  createGame,
  startGame,
  gameSelector,
  startNextRound
} from '../redux/ducks/game';
import { clearStorageWithoutToken } from '../utils/localStorangeManagement';
import refreshPage from '../utils/refreshPage';
import Button from '../components/button';
import Players from '../components/Players';
import Cards from '../components/Cards';

export default function HomeScreen() {
  const history = useHistory();
  const game = useSelector(gameSelector);
  const players = game?.players;
  const [createGameApi, startGameApi, startNextRoundApi] = useActions([createGame, startGame, startNextRound]);
  const createGameHandler = () => createGameApi();
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
  const joinTheGame = async () => {
    history.push('/joingame');
    clearStorageWithoutToken();
    refreshPage();
  };

  const closeTheGame = async () => {
    clearStorageWithoutToken();
    refreshPage();
  };

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

        {(!gameIsStarted || gameOver) && (
          <div
            css={css`
              flex-direction: column;
              display: flex;
              background-color: #463973;
              border-radius: 5px;
            `}
          >
            {gameIsCreated && !gameIsStarted && (
              <Button
                onClick={startGameHandler}
                title="Начать игру"
              />
            )}
            {(!gameIsCreated || gameOver) && (
              <Button
                onClick={createGameHandler}
                title="Новая игра"
              />
            )}
            {!gameIsCreated && (
              <Button
                onClick={joinTheGame}
                title="Присоедениться к игре"
              />
            )}
          </div>
        )}
        {gameIsCreated && (
          <div
            css={css`
            flex-direction: column;
            display: flex;
            background-color: #463973;
            border-radius: 5px;
          `}
          >
            <Button
              onClick={closeTheGame}
              title="Сбросить игру"
            />
          </div>
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
          <div
            css={css`
              flex-direction: column;
              display: flex;
              background-color: #463973;
              border-radius: 5px;
            `}
          >
            <Button
              onClick={startNextRoundApi}
              title="Следующий раунд"
            />
          </div>
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
