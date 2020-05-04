/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import {
  Formik, Field, Form, ErrorMessage
} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import useActions from '../hooks/useActions';
import {
  joinGame,
  selectCard,
  joinDataSelector,
  playerSelector,
  turnSelector,
  youSelector
} from '../redux/ducks/game';
import PlayerGameComponent from '../components/PlayerGameComponent';

export default function JoinGame() {
  const [joinGameApi, selectCardApi] = useActions([joinGame, selectCard]);
  const joinData = useSelector(joinDataSelector);
  const player = useSelector(playerSelector);
  const me = useSelector(youSelector);
  const turn = useSelector(turnSelector);

  return (
    <Layout>
      <PlayerGameComponent
        me={me}
        turn={turn}
        player={player}
        selectCardApi={selectCardApi}
      />
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
          {({ errors, touched }) => (
            <Form>
              <div>
                <div>
                  <p>Введи свое имя</p>
                  <Field name="playerName" className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`} type="text" />
                  <ErrorMessage name="playerName" className="invalid-feedback" component="div" />
                </div>
              </div>
              <div>
                <div>
                  <p>Введи имя игры</p>
                  <Field name="gameId" type="text" className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`} />
                  <ErrorMessage name="gameId" className="invalid-feedback" component="div" />
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
    </Layout>
  );
}
