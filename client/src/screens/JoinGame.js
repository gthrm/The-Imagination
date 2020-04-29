/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { css } from '@emotion/core';
import {
  Formik, Field, Form, ErrorMessage
} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import {
  joinGame,
  joinDataSelector,
  turnSelector,
  gameStatusMessageSelector,
  youSelector
} from '../redux/ducks/game';

export default function JoinGame() {
  const title = 'JoinGame';
  const [joinGameApi] = useActions([joinGame]);
  const joinData = useSelector(joinDataSelector);
  const turn = useSelector(turnSelector);
  const gameStatusMessage = useSelector(gameStatusMessageSelector);
  const me = useSelector(youSelector);

  return (
    <Layout>
      <div
        css={css`
          font-size: 40px;
      `}
      >
        {title}
      </div>
      {!!turn?.data && (
      <div
        css={css`
          font-size: 30px;
      `}
      >
        {turn?.data === me?.playerName ? 'Ваш ход' : `Ходит ${turn?.data}`}
      </div>
      )}
      <div>
        {!!me?.playerName && (
          <p>
            Игрок:
            <h4>{me.playerName.toUpperCase()}</h4>
          </p>
        )}
        {!!me?.gameId && (
          <p>
            Игра:
            <h4>{me.gameId.toUpperCase()}</h4>
          </p>
        )}
      </div>
      {!joinData?.message && (
        <Formik
          initialValues={{
            playerName: '',
            gameId: ''
          }}
          validationSchema={Yup.object().shape({
            playerName: Yup.string()
              .required('Имя пользователя должно быть заполнено')
              .min(3, 'Имя пользователя должно быть не менее 3-х символов'),
            gameId: Yup.string()
              .min(10, 'Имя игры должно быть не менее 10 символов')
              .required('Имя игры должно быть заполнено')
          })}
          onSubmit={(fields) => joinGameApi(fields)}
        >
          {({ errors, status, touched }) => (
            <Form>
              <div>
                <div>
                  <p>Введи свое имя</p>
                  <Field name="playerName" type="text" />
                  <ErrorMessage name="playerName" component="div" />
                </div>
              </div>
              <div>
                <div>
                  <p>Введи имя игры</p>
                  <Field name="gameId" type="text" className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`} />
                  <ErrorMessage name="gameId" component="div" />
                </div>
              </div>
              <div>
                <button type="submit">Присоедениться</button>
                <button type="reset">Сбросить</button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      <p>
        {!gameStatusMessage?.data ? joinData?.error || joinData?.message : gameStatusMessage?.data}
      </p>
    </Layout>
  );
}
