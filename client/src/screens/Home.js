import React from 'react';
import { css } from '@emotion/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../components/layout';
import ButtonLayout from '../components/ButtonLayout';
import useActions from '../hooks/useActions';
import {
  createGame,
  gameSelector,
  joinDataSelector
} from '../redux/ducks/game';
import { clearStorageWithoutToken } from '../utils/localStorangeManagement';
import refreshPage from '../utils/refreshPage';
import Button from '../components/button';

export default function Home() {
  const history = useHistory();
  const game = useSelector(gameSelector);
  const joinData = useSelector(joinDataSelector);
  const [createGameApi] = useActions([createGame]);

  const gameOver = game?.gameOver;
  const gameIsCreated = game;

  const createGameHandler = () => createGameApi();
  const goToGame = () => {
    history.push('/gamehost');
  };
  const closeTheGame = () => {
    clearStorageWithoutToken();
    refreshPage();
  };

  const joinTheGame = () => {
    history.push('/game');
  };

  const aboutRules = () => {
    history.push('/rules');
  };

  const aboutInfo = () => {
    history.push('/info');
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
        <ButtonLayout>
          {(!gameIsCreated || gameOver)
            ? (
              <Button
                onClick={createGameHandler}
                title="Новая игра"
              />
            )
            : (
              <Button
                onClick={goToGame}
                title="Продолжить игру"
              />
            )}
          {!gameIsCreated && (
            <Button
              onClick={joinTheGame}
              title={joinData ? 'Продолжить игру' : 'Присоедениться к игре'}
            />
          )}
          {(gameIsCreated || !!joinData) && (
            <Button
              onClick={closeTheGame}
              title="Сбросить игру"
            />
          )}
          <Button
            onClick={aboutRules}
            title="Правила игры"
          />
          <Button
            onClick={aboutInfo}
            title="Инофрмация"
          />
        </ButtonLayout>
      </div>
    </Layout>
  );
}
