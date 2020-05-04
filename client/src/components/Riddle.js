/* eslint-disable react/button-has-type */
import React from 'react';
import {
  Formik, Field, Form, ErrorMessage
} from 'formik';
import * as Yup from 'yup';
import useActions from '../hooks/useActions';
import {
  setRiddle
} from '../redux/ducks/game';

export default function Riddle() {
  const [setRiddleApi] = useActions([setRiddle]);
  return (
    <Formik
      initialValues={{
        playerName: '',
        gameId: ''
      }}
      validationSchema={Yup.object().shape({
        riddle: Yup.string()
          .required('Впишите вашу загадку')
          .min(10, 'Загадка должна содержать не менее 10 символов')
      })}
      onSubmit={(fields) => setRiddleApi(fields)}
    >
      {({ errors, touched }) => (
        <Form>
          <div>
            <div>
              <p>Впишите вашу загадку</p>
              <Field name="riddle" type="text" className={`form-control${errors.riddle && touched.riddle ? ' is-invalid' : ''}`} />
              <ErrorMessage name="riddle" className="invalid-feedback" component="div" />
            </div>
          </div>
          <div>
            <button type="submit">Загадать</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
